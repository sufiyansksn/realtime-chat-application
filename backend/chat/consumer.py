import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from users.models import User

from .models import Room, RoomMembership, Message
from channels.db import database_sync_to_async

import redis

redis_client = redis.Redis(
    host="127.0.0.1",
    port=6379,
    decode_responses=True,
)

def add_user_connection(user_id,channel_name):
    key = f"presence:user:{user_id}:connections"
    redis_client.sadd(key, channel_name)

def remove_user_connection(user_id, channel_name):
    key = f"presence:user:{user_id}:connections"
    redis_client.srem(key, channel_name)


def is_user_online(user_id):
    key = f"presence:user:{user_id}:connections"
    return redis_client.scard(key) > 0      


@database_sync_to_async
def is_room_member(room_id, user):
    return RoomMembership.objects.filter(
        room_id = room_id,
        user = user
    ).exists()

class ChatConsumer(WebsocketConsumer):

    def connect(self): #self refers to the current websocket connection.

        #getting the room-id from the "websockets url"
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]

        is_member = async_to_sync(is_room_member)(
            self.room_id,
            self.scope["user"]
        )

        if not is_member:
            self.close(code=4003)
            return

        #create group name
        self.room_group_name = f"room_{self.room_id}"

        #adding the websocket connection to the grup
        async_to_sync(self.channel_layer.group_add)(  #self.channel_layer.group_add() syas "Add this WebSocket connection to this group."
            self.room_group_name,
            self.channel_name
            #the above both lines means: Put the WebSocket connection specific.xyz123 inside the group room_6.
        )
        self.accept() #giving permission. The browser will fail to establish the WebSocket

        self.user_id = self.scope["user"].id
        self.connection_name = self.channel_name

        add_user_connection(self.user_id, self.connection_name)

        print("Presence connection added:", self.user_id, self.connection_name)

        print("Connected")
        print("Room ID:", self.room_id)
        print("Group:", self.room_group_name)
        print(self.scope["user"])


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)( #group_discard() removes this connection from the room group.
            self.room_group_name,
            self.channel_name,
        )

        if hasattr(self, "user_id"):
            remove_user_connection(
                self.user_id,
                self.connection_name,
            )
            print("Presence connection removed:", self.user_id, self.connection_name)

        print("Disconnected")
        print("Room ID:", self.room_id)
        print("Close Code:", close_code)


    def receive(self, text_data): #receive method is called when the client sends a message.
        print("Message Received", text_data) #text_data is acarrying the message.

        #1. find the room 
        room = Room.objects.get(id=self.room_id) #taking the room object

        #2. Save the messages to database.
        message = Message.objects.create(
            room=room,
            sender=self.scope["user"],
            content=text_data
        )

        #3. Broadcast to everyone in the room.
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, #means send the event to everyone in this room
            {
                "type": "chat_message",
                "message": {
                    "id": message.id,
                    "sender": message.sender_id,
                    "content": message.content,
                    "created_at": message.created_at.isoformat(),
                }
            }
        )

        # self.send(text_data=text_data)

    def chat_message(self, event):

        message = event["message"]
        # self.send(text_data=message)
        self.send(text_data=json.dumps(message))

        


class PresenceConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            self.close(code=4003)
            return

        self.presence_group_name = f"presence_user_{self.user.id}"

        async_to_sync(self.channel_layer.group_add)(
            self.presence_group_name,
            self.channel_name,
        )

        self.accept()

        self.user_id = self.user.id
        self.connection_name = self.channel_name

        connections_before = redis_client.scard(f"presence:user:{self.user_id}:connections")

        add_user_connection(self.user_id, self.connection_name)

        connections_after = redis_client.scard(f"presence:user:{self.user_id}:connections")

        if connections_before == 0 and connections_after > 0:
            print("User became ONLINE:", self.user_id)

        print("Presence Websocket Connected:", self.user.id)
        print("Presence Connection Added:", self.user_id, self.connection_name)
        print("Active connections:",redis_client.scard(f"presence:user:{self.user_id}:connections"),)

    
    def disconnect(self, close_code):
        print("Presence disconnect called:", close_code)

        if hasattr(self, "presence_group_name"):
            async_to_sync(self.channel_layer.group_discard)(
                self.presence_group_name,
                self.channel_name,
            )

        if hasattr(self, "user_id"):
            remove_user_connection(self.user_id, self.connection_name)

            connection_after = redis_client.scard(f"presence:user:{self.user_id}:connections")
            if connection_after == 0:
                print("User becomed OFFLINE:", self.user_id)

            print("Presence connection removed:",self.user_id, self.connection_name,)
            print("Active connections:",redis_client.scard(f"presence:user:{self.user_id}:connections"),)


    def presence_update(self, event):
        self.send(text_data=json.dumps(event["data"]))