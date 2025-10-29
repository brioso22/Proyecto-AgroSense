from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class User(AbstractUser):
    # ejemplo: zona geográfica / empresa / rol
    zone = models.CharField(max_length=100, blank=True)
