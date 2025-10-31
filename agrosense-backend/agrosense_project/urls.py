from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter 

# Importaciones de los ViewSets
from accounts.views import UserViewSet
from plans.views import PlanViewSet
from telemetry.views import DeviceViewSet, TelemetryViewSet
from parcels.views import ParcelViewSet
from userplans.views import UserPlanViewSet  # 👈 importa el nuevo ViewSet

# JWT (tokens)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# --- Routers ---
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'plans', PlanViewSet, basename='plans')
router.register(r'devices', DeviceViewSet, basename='devices')
router.register(r'telemetry', TelemetryViewSet, basename='telemetry')
router.register(r'parcels', ParcelViewSet, basename='parcels')
router.register(r'userplans', UserPlanViewSet, basename='userplans')  # 👈 añadido correctamente

# --- URL patterns ---
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),  # opcional
]
