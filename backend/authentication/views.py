from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from users.models import User
from users.serializers import UserSerializer

class MeView(APIView):
    
    permission_clasess = [IsAuthenticated]

    def get(self,request):
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