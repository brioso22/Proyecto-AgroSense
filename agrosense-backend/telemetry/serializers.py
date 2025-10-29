from rest_framework import serializers
from .models import Device, Telemetry

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

class TelemetrySerializer(serializers.ModelSerializer):
    # Mostrar datos básicos del dispositivo en la respuesta
    device_name = serializers.CharField(source='device.name', read_only=True)

    class Meta:
        model = Telemetry
        fields = ['id', 'device', 'device_name', 'timestamp', 'humidity', 'temperature', 'ph']
