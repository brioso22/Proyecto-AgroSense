from rest_framework import viewsets, permissions
from .models import Parcel
from .serializers import ParcelSerializer

class ParcelViewSet(viewsets.ModelViewSet):
    serializer_class = ParcelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Cada usuario solo puede ver su parcela
        return Parcel.objects.filter(user=self.request.user)

    