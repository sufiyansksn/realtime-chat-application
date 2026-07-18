from django.db import models
from users.models import User

# Create your models here.

class Room(models.Model):
    
    name = models.CharField(max_length=100, unique=True,)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="created_rooms",)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class RoomMembership(models.Model):

    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} -> {self.room.name}"
    

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages",)

    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="messages",)

    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True,)

    def __str__(self):
        if self.sender:
            return f"{self.sender.username}: {self.content[:30]}"
        return f"Deleted User: {self.content[:30]}"
