from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):

    def connect(self): #self refers to the current websocket connection.
        print("✅Connect Called")
        self.accept() #giving permission. The browser will fail to establish the WebSocket

        

