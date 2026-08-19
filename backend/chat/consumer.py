import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Room, Message
from users.models import User


class ChatConsumer(WebsocketConsumer):

    def connect(self): #self refers to the current websocket connection.

        #getting the room-id from the "websockets url"
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]

        #create group name
        self.room_group_name = f"room_{self.room_id}"

        #adding the websocket connection to the grup
        async_to_sync(self.channel_layer.group_add)(  #self.channel_layer.group_add() syas "Add this WebSocket connection to this group."
            self.room_group_name,
            self.channel_name
            #the above both lines means: Put the WebSocket connection specific.xyz123 inside the group room_6.
        )
        self.accept() #giving permission. The browser will fail to establish the WebSocket

        print("Connected")
        print("Room ID:", self.room_id)
        print("Group:", self.room_group_name)
        print(self.scope["user"])

        #get the old messages from PostgreSQL
        messages = Message.objects.filter(room_id=self.room_id).order_by("created_at")

        #send the old messages to this client
        for message in messages:
            #print(message.content)
            old_message = {
                "id": message.id,
                "sender": message.sender_id,
                "content": message.content,
                "created_at": message.created_at.isoformat(),
            }

            self.send(
                text_data=json.dumps(old_message)
            )

        

    def receive(self, text_data): #receive method is called when the client sends a message.
        print("Message Received", text_data) #text_data is acarrying the message.

        #1. find the room 
        room = Room.objects.get(id=self.room_id) #taking the room object

        #2. Save the messages to database.
        message = Message.objects.create(
            room=room,
            sender=User.objects.get(id=1),
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

        

