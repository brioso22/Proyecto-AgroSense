import requests
import random
import time
from datetime import date, timedelta

# Usuario y contraseña
USERNAME = "marcos"
PASSWORD = "Osint-258133"

# Endpoints
TOKEN_URL = "http://127.0.0.1:8000/api/token/"
PARCELS_URL = "http://127.0.0.1:8000/api/parcels/"

# Obtener token JWT
def get_token():
    res = requests.post(TOKEN_URL, json={"username": USERNAME, "password": PASSWORD})
    if res.status_code == 200:
        return res.json().get("access")
    else:
        print(f"❌ Error al autenticar: {res.status_code} {res.text}")
        return None

token = get_token()
if not token:
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

# Obtener la parcela existente del usuario
res_get = requests.get(PARCELS_URL, headers=headers)
if res_get.status_code != 200:
    print(f"❌ No se pudo obtener la parcela: {res_get.status_code} {res_get.text}")
    exit(1)

parcelas = res_get.json()
if not parcelas:
    print("❌ No hay parcelas registradas para este usuario.")
    exit(1)

# Suponemos que solo hay una parcela por usuario
parcel_id = parcelas[0]["id"]
print(f"ℹ️ Actualizando datos de la parcela ID {parcel_id}")

# Simulación de datos
while True:
    sowing_date = date.today() - timedelta(days=random.randint(0, 10))
    expected_harvest_date = sowing_date + timedelta(days=random.randint(60, 120))
    
    payload = {
        "irrigation_count": random.randint(0, 5),
        "ambient_temperature": round(random.uniform(20.0, 35.0), 1),
        "soil_ph": round(random.uniform(5.5, 7.5), 2),
        "humidity": round(random.uniform(40.0, 90.0), 1),
        "weather_info": {
            "rain_mm": round(random.uniform(0, 20), 1),
            "wind_kmh": round(random.uniform(0, 30), 1),
            "sun_hours": round(random.uniform(0, 12), 1)
        },
        "sowing_date": sowing_date.isoformat(),
        "expected_harvest_date": expected_harvest_date.isoformat()
    }

    # PATCH al backend
    patch_url = f"{PARCELS_URL}{parcel_id}/"
    res_patch = requests.patch(patch_url, json=payload, headers=headers)
    if res_patch.status_code in [200, 204]:
        print(f"✅ Datos actualizados: {payload}")
    else:
        print(f"⚠️ Error PATCH {res_patch.status_code}: {res_patch.text}")

    time.sleep(5)
