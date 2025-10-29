from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Device, Telemetry
from .serializers import DeviceSerializer, TelemetrySerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticated]
    

class TelemetryViewSet(viewsets.ModelViewSet):
    queryset = Telemetry.objects.all().order_by('-timestamp')
    serializer_class = TelemetrySerializer
    permission_classes = [IsAuthenticated]

