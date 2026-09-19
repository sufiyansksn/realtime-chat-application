from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):

    """
        Custom User model

        We inherit from Django's AbstractUser so we keep  all built-in 
        authentication features while allowing future customizations.
    """
    email = models.EmailField(unique=True)