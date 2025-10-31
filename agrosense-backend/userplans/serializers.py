from rest_framework import serializers
from .models import Plan, UserPlan

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'


class UserPlanSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)

    class Meta:
        model = UserPlan
        fields = ['id', 'user', 'plan', 'plan_name', 'location_latitude', 'location_longitude', 'area_m2', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate_plan(self, value):
        """Valida que el plan exista antes de crear el UserPlan"""
        if not Plan.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("El plan seleccionado no existe")
        return value

    def create(self, validated_data):
        # Asigna automáticamente el usuario autenticado
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
