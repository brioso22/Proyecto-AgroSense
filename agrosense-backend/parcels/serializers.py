from rest_framework import serializers
from .models import Parcel

class ParcelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parcel
        fields = [
            'id', 'name', 'latitude', 'longitude',
            'crop_name', 'sowing_date', 'expected_harvest_date',
            'irrigation_count', 'soil_ph', 'ambient_temperature',
            'humidity', 'weather_info', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        # Asigna automáticamente el usuario autenticado
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
