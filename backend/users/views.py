from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import User
from .serializers import UserSearchSerializer

# Create your views here.

class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("username", "").strip()

        users = User.objects.filter(username__icontains = query).exclude(id=request.user.id)[:10]

        serializer = UserSearchSerializer(users, many=True)

        return Response(serializer.data)