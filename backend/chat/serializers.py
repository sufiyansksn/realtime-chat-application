from rest_framework import serializers
from .models import Room, Message,RoomMembership, ChatRequest
from users.serializers import UserSearchSerializer

class RoomSerializer(serializers.ModelSerializer):

    other_user = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            "id",
            "name",
            "created_at",
            "other_user",
        ]

    def get_other_user(self, room):
        current_user = self.context["request"].user

        membership = RoomMembership.objects.filter(room=room).exclude(user=current_user).first()

        if not membership:
            return None

        user = membership.user

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
        }


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = [
            "room",
            "sender",
        ]

class ChatRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRequest
        fields = ["id", "receiver", "status", "created_at"]
        read_only_fields = ["id", "status", "created_at"]

class IncomingChatRequestSerializer(serializers.ModelSerializer):
    sender = UserSearchSerializer(read_only=True)

    class Meta:
        model = ChatRequest
        fields = ["id", "sender", "status", "created_at"]