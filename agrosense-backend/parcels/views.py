from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import Parcel
from .serializers import ParcelSerializer

class ParcelViewSet(viewsets.ModelViewSet):
    queryset = Parcel.objects.all()
    serializer_class = ParcelSerializer
    