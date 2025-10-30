from django.contrib import admin
from django.urls import path, include
# Importación correcta de DefaultRouter
from rest_framework.routers import DefaultRouter 
from accounts.views import UserViewSet
from plans.views import PlanViewSet
from telemetry.views import DeviceViewSet, TelemetryViewSet
from parcels.views import ParcelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Registramos los routers
router = DefaultRouter() # Usamos DefaultRouter importado
router.register(r'users', UserViewSet)
router.register(r'plans', PlanViewSet)
router.register(r'devices', DeviceViewSet)
router.register(r'telemetry', TelemetryViewSet)
# Aplicamos el basename 'parcel' al registro existente de Parcels
router.register(r'parcels', ParcelViewSet, basename='parcel') 

# urlpatterns única
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # endpoints de la API
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),  # opcional
]
