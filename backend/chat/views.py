from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Room, RoomMembership, Message, ChatRequest
from .serializers import RoomSerializer, MessageSerializer, ChatRequestSerializer
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

class ChatRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get("receiver")

        if receiver_id == request.user.id:
            return Response(
                {"details":"You cannot send a chat request to yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_request = ChatRequest.objects.filter(
            sender = request.user,
            receiver_id = receiver_id,
            status="PENDING"
        ).first()
        if existing_request:
            return Response(
                {"details":"A chat request is already pending"},
                status=status.HTTP_400_BAD_REQUEST
            )

        reverse_request = ChatRequest.objects.filter(
            sender_id = receiver_id,
            receiver = request.user,
            status="PENDING"
        ).first()
        if reverse_request:
            return Response(
                {"details":"This User already sent you a chat request"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        

        serializer = ChatRequestSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save(
                sender = request.user
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
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



