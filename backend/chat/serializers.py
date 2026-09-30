from rest_framework import serializers
from .models import Room, Message, ChatRequest

class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = [
            "id",
            "name",
            "created_at",
        ]

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