from django.db import models
from django.conf import settings

class UserPlan(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_plan'
    )
    # Datos del plan comprado
    plan_name = models.CharField(max_length=100)
    plan_description = models.TextField()
    plan_price = models.DecimalField(max_digits=10, decimal_places=2)
    plan_coverage_area_km2 = models.FloatField()

    # Datos de la parcela del usuario
    location_latitude = models.FloatField()
    location_longitude = models.FloatField()
    area_m2 = models.FloatField(help_text="Área en metros cuadrados del terreno")

    # Fechas
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan_name}"
