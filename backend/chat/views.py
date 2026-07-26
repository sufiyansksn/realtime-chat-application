from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Room, RoomMembership, Message
from .serializers import RoomSerializer, MessageSerializer
# Create your views here.


class RoomListCreateView(ListCreateAPIView):

    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Room.objects.filter(
            roommembership__user=self.request.user
        )

    def perform_create(self, serializer):
        room = serializer.save(created_by=self.request.user)

        RoomMembership.objects.create(
            room=room,
            user=self.request.user
        )

class MessageListCreateView(ListCreateAPIView):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs["room_id"]

        room = get_object_or_404(
            Room,
            id=room_id
        )
        
        is_member = RoomMembership.objects.filter(
            room=room,
            user=self.request.user
        ).exists()

        if not is_member:
            raise PermissionDenied(
                "You are not a member of this room."
            )

        return Message.objects.filter(
            room=room
        )

    def perform_create(self, serializer):
        room_id = self.kwargs["room_id"]

        room = get_object_or_404(
            Room,
            id = room_id
        )

        is_member = RoomMembership.objects.filter(
            room=room,
            user=self.request.user
        ).exists()

        if not is_member:
            raise PermissionDenied(
                "You are not member of this room."
            )

        serializer.save(
            room=room,
            sender=self.request.user
        )

    



    


# class RoomCreateView(CreateAPIView):

#     queryset = Room.objects.all()

#     serializer_class = RoomSerializer

#     permission_class = [IsAuthenticated]

#     def perform_create(self, serializer):
#         room = serializer.save(created_by=self.request.user)

#         RoomMembership.objects.create(
#             room=room,
#             user=self.request.user
#         )


# class RoomListView(ListAPIView):

#     serializer_class = RoomSerializer

#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Room.objects.filter(
#             roommembership__user=self.request.user
#         )



