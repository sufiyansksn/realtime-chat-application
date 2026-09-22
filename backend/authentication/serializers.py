import re
from rest_framework import serializers
from users.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class LoginSerializer(TokenObtainPairSerializer):

    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = User.objects.filter(email=email).first()

        if not user:
            raise serializers.ValidationError(
                "No account found with this email"
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                "Incorrect password"
            )

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    

class RegisterSerializer(serializers.ModelSerializer):

    confirm_password = serializers.CharField(
        write_only = True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "confirm_password"
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

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "Passwords do not match."
            )

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user