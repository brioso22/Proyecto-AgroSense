from django.db import models
from django.conf import settings

# Create your models here.

class Device(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class Telemetry(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    humidity = models.FloatField()
    temperature = models.FloatField()
    ph = models.FloatField()
