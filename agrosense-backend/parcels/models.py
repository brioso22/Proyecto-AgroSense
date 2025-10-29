from django.db import models
from django.conf import settings
# Si más adelante quieres usar mapas con GeoDjango, se importa así:
# from django.contrib.gis.db import models as gis_models

class Parcel(models.Model):
    """
    Modelo que representa una parcela de cultivo de un usuario.
    Si no usas GeoDjango, almacena latitud y longitud como floats.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='parcels'
    )
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)  # opcional: saber cuándo se creó

    def __str__(self):
        return f"{self.name} ({self.latitude}, {self.longitude})"

