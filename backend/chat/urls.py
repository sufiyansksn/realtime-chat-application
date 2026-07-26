from django.urls import path
from .views import RoomListCreateView, MessageListCreateView

urlpatterns = [
    path("rooms/<int:room_id>/messages/", MessageListCreateView.as_view(), name="message-list"),
    # path("rooms/<int:room_id>/messages/", MessageListView, name="message-list")
    path("rooms/", RoomListCreateView.as_view(), name="rooms"),
    # path("rooms/", RoomCreateView.as_view(), name="create-room"),
]