from django.shortcuts import render

from rest_framework import viewsets, permissions
from .models import Plan, UserPlan
from .serializers import PlanSerializer, UserPlanSerializer

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all().order_by('-created_at')
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]  # Cualquiera puede ver los planes

class UserPlanViewSet(viewsets.ModelViewSet):
    serializer_class = UserPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo devuelve el plan del usuario autenticado
        return UserPlan.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado
        serializer.save(user=self.request.user)
