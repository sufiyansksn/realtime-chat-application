from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from users.models import User
from users.serializers import UserSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import LoginSerializer

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

class MeView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        print("ME Authorization:", request.headers.get("Authorization"))
        print("ME request user:", request.user)
        print("ME request user_id:", request.user.id)

        user = request.user
        
        serializer = UserSerializer(user)

        return Response(serializer.data)


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )