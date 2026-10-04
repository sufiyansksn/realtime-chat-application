from django.urls import path
from .views import RoomListCreateView, MessageListCreateView, ChatRequestCreateView, ChatRequestAcceptView, ChatRequestDeclineView, ChatRequestListView

urlpatterns = [
    path("rooms/<int:room_id>/messages/", MessageListCreateView.as_view(), name="message-list"),
    path("rooms/", RoomListCreateView.as_view(), name="rooms"),
    path("request/", ChatRequestCreateView.as_view(), name="chat-request-create"),
    path("request/<int:request_id>/accept/", ChatRequestAcceptView.as_view(), name="chat-request-accept"),
    path("request/<int:request_id>/decline/", ChatRequestDeclineView.as_view(), name="chat-request-decline"),
    path("requests/", ChatRequestListView.as_view(), name="chat-request-list")
]