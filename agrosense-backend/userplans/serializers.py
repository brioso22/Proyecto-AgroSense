from rest_framework import serializers
from .models import UserPlan

class UserPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPlan
        fields = [
            'id',
            'user',
            'plan_name',
            'plan_description',
            'plan_price',
            'plan_coverage_area_km2',
            'location_latitude',
            'location_longitude',
            'area_m2',
            'start_date',
            'end_date',
            'created_at',
        ]
        read_only_fields = ['user', 'created_at', 'start_date']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
