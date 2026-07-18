from django.urls import path
from .views import RoomListCreateView

urlpatterns = [
    path("rooms/", RoomListCreateView.as_view(), name="rooms"),
    # path("rooms/", RoomCreateView.as_view(), name="create-room"),
]