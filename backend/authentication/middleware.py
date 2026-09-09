from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import UntypedToken

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
            UntypedToken(token)

        return await super().__call__(scope, receive, send)