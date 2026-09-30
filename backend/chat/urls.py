from django.urls import path
from .views import RoomListCreateView, MessageListCreateView, ChatRequestCreateView

urlpatterns = [
    path("rooms/<int:room_id>/messages/", MessageListCreateView.as_view(), name="message-list"),
    path("rooms/", RoomListCreateView.as_view(), name="rooms"),
    path("request/", ChatRequestCreateView.as_view(), name="chat-request-create"),
]