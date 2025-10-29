from django.db import models
from django.conf import settings

# Create your models here.


class Plan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    coverage_area_km2 = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
