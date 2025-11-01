from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
            'zone',
            'is_staff',
            'is_active',
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'default': False},
            'is_active': {'default': True},
        }

    def create(self, validated_data):
        # Crear usuario con password correctamente encriptado
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
