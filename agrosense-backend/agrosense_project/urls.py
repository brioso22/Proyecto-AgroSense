from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from accounts.views import UserViewSet
from plans.views import PlanViewSet
from telemetry.views import DeviceViewSet, TelemetryViewSet
from parcels.views import ParcelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Registramos los routers
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'plans', PlanViewSet)
router.register(r'devices', DeviceViewSet)
router.register(r'telemetry', TelemetryViewSet)
router.register(r'parcels', ParcelViewSet)

# urlpatterns única
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # endpoints de la API
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),  # opcional
]
