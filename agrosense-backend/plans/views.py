from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Plan
from .serializers import PlanSerializer

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all().order_by('-created_at')
    serializer_class = PlanSerializer
    permission_classes = [AllowAny]  # <--- desactiva autenticación para pruebas
