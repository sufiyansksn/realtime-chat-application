import re
from rest_framework import serializers
from users.models import User


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }
    
    def validate_username(self, value):
        if len(value) < 4:
            raise serializers.ValidationError(
                "Username must be atleast 4 characters long."
            )

        if len(value) > 30:
            raise serializers.ValidationError(
                "Username must be at most 30 characters long"
            )

        if not re.match(r"^[a-zA-Z0-9_]+$", value):
            raise serializers.ValidationError(
                "Username can only contains letters, numbers, and underscores"
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email is already registered."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user