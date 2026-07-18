from django.shortcuts import render

from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Room, RoomMembership
from .serializers import RoomSerializer
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



