from django.urls import re_path #we need re_path for to create websocket routes. exactly like HTTP
from .consumer import ChatConsumer, PresenceConsumer #ChatConsumer handles wensockets like how view handles HTTP

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_id>\d+)/$", ChatConsumer.as_asgi(),),
    re_path(r"ws/presence/$",PresenceConsumer.as_asgi(),),
]

# \d+ - one or more digits. 


