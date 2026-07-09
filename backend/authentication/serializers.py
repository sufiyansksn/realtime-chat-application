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
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user