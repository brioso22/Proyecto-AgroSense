from django.db import models

# Create your models here.

# models.py

from django.db import models
from django.conf import settings

class Plan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    coverage_area_km2 = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserPlan(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_plan'
    )
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    location_latitude = models.FloatField()
    location_longitude = models.FloatField()
    area_m2 = models.FloatField(help_text="Área en metros cuadrados del terreno")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"
