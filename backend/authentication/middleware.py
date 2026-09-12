from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

@database_sync_to_async
def get_user(user_id):
    User = get_user_model()
    return User.objects.get(id=user_id)

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        print("JWT Middleware Running")

        # Get the query string from the WebSocket connection and convert bytes to text
        query_string = scope["query_string"].decode()

        # Parse the query string into a dictionary
        query_params = parse_qs(query_string)

        # Get the JWT token from the "token" query parameter
        token = query_params.get("token", [None])[0]

        print("Token:", token)

        if token:
            try:
                validated_token = UntypedToken(token)
                user_id = validated_token["user_id"]

                print("User ID:", user_id)

                user = await get_user(user_id)
                print("User:", user)
                
                scope["user"] = user

            except TokenError:
                print("invalid or expired JWT token")

                await send({
                    "type": "websocket.close",
                    "code": 4001,
                })

                return 
        else:
            print("No JWt provided")
            await send({
                "type": "websocket.close",
                "code": 4001
            })
            return 

        return await super().__call__(scope, receive, send)