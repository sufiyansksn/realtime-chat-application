from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Room, RoomMembership, Message, ChatRequest
from .serializers import RoomSerializer, MessageSerializer, ChatRequestSerializer, IncomingChatRequestSerializer

from django.shortcuts import get_object_or_404
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

class ChatRequestAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        chat_request = get_object_or_404(
            ChatRequest,
            id=request_id
        )

        if chat_request.receiver != request.user:
            return Response(
                {"detail": "You are not allowed to accept this chat request."},
                status=status.HTTP_403_FORBIDDEN
            )

        if chat_request.status != "PENDING":
            return Response(
                {"detail": "This chat request has been processed."},
                status = status.HTTP_400_BAD_REQUEST
            )

        user1_id = min(chat_request.sender.id, chat_request.receiver.id)
        user2_id = max(chat_request.sender.id, chat_request.receiver.id)
        room_name = f"private_{user1_id}_{user2_id}"

        room, created = Room.objects.get_or_create(
            name = room_name,
            defaults={
                "created_by":request.user
            }
        )

        RoomMembership.objects.get_or_create(
            room=room,
            user=chat_request.sender
        )

        RoomMembership.objects.get_or_create(
            room=room,
            user=chat_request.receiver
        )

        chat_request.status = "ACCEPTED"
        chat_request.save()

        return Response(
            {
                "detail": "Chat request accepted.",
                "request_id": chat_request.id,
                "status": chat_request.status,
                "room_id": room.id,
            },
            status=status.HTTP_200_OK
        )

class ChatRequestDeclineView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        chat_request = get_object_or_404(
            ChatRequest,
            id = request_id
        )

        if chat_request.receiver != request.user:
            return Response(
                {"detail":"You are not allowed to Decline this chat request"},
                status=status.HTTP_403_FORBIDDEN
            )

        if chat_request.status != "PENDING":
            return Response(
                {"detail": "This chat request has been Processed"},
                status.HTTP_400_BAD_REQUEST
            )

        chat_request.status = "DECLINED"
        chat_request.save()

        return Response(
            {
                "detail": "Chat request declined.",
                "request_id": chat_request.id,
                "status": chat_request.status,
            },
            status=status.HTTP_200_OK
        )

class ChatRequestListView(APIView):
    Permissi_classes = [IsAuthenticated]

    def get(self, request):
        requests = ChatRequest.objects.filter(
            receiver = request.user,
            status = "PENDING"
        )

        serializer = IncomingChatRequestSerializer(
            requests,
            many=True
        )

        return Response (serializer.data)


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



