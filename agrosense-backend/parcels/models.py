from django.db import models
from django.conf import settings

class Parcel(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='parcel'
    )
    # Información básica de la parcela
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    # Cultivo
    crop_name = models.CharField(max_length=100)
    sowing_date = models.DateField()
    expected_harvest_date = models.DateField()

    # Datos de sensores / automatización
    irrigation_count = models.PositiveIntegerField(default=0)
    soil_ph = models.FloatField(null=True, blank=True)
    ambient_temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)

    # Datos del clima
    weather_info = models.JSONField(blank=True, null=True, help_text="Datos de clima: lluvia, temperatura, etc.")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.crop_name}) - {self.user.username}"
