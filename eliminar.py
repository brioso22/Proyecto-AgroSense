import requests

# --- Configuración ---
# USUARIO Y CONTRASEÑA (debe ser un usuario existente)
USERNAME = "yesy"
PASSWORD = "Yesy_Hermosa1999"

# ENDPOINTS
TOKEN_URL = "http://127.0.0.1:8000/api/token/"
PARCELS_URL = "http://127.0.0.1:8000/api/parcels/" # Para obtener la lista
# --------------------

# 1. Obtener token JWT
def get_token():
    """Autentica al usuario y retorna el token de acceso."""
    res = requests.post(TOKEN_URL, json={"username": USERNAME, "password": PASSWORD})
    if res.status_code == 200:
        print("🔑 Autenticación exitosa. Token obtenido.")
        return res.json().get("access")
    else:
        print(f"❌ Error al autenticar: {res.status_code} {res.text}")
        return None

# 2. Función principal para el borrado
def delete_all_parcels(token):
    """Obtiene todas las parcelas del usuario y las borra una por una."""
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2.1. Obtener la lista de parcelas
    print("\n--- Paso 1: Obteniendo lista de parcelas del usuario... ---")
    res_get = requests.get(PARCELS_URL, headers=headers)
    
    if res_get.status_code != 200:
        print(f"❌ Error al obtener parcelas: {res_get.status_code} {res_get.text}")
        return

    parcelas = res_get.json()
    num_parcelas = len(parcelas)
    
    if num_parcelas == 0:
        print("✅ No se encontraron parcelas para borrar. ¡Base de datos limpia!")
        return
        
    print(f"📋 Se encontraron {num_parcelas} parcelas para borrar.")
    
    # 2.2. Iterar y borrar
    print("\n--- Paso 2: Ejecutando borrado (DELETE) para cada parcela... ---")
    deleted_count = 0
    
    for i, parcela in enumerate(parcelas):
        parcel_id = parcela.get("id")
        delete_url = f"{PARCELS_URL}{parcel_id}/" # URL específica para el DELETE
        
        res_delete = requests.delete(delete_url, headers=headers)
        
        if res_delete.status_code == 204: # 204 No Content es el código de éxito de DELETE
            print(f"   [OK] Parcel ID {parcel_id} ({i+1}/{num_parcelas}) borrada exitosamente.")
            deleted_count += 1
        else:
            print(f"   [FAIL] Error al borrar ID {parcel_id}: {res_delete.status_code} {res_delete.text}")

    print(f"\n--- Resumen: {deleted_count} de {num_parcelas} parcelas borradas. ---")


# --- Ejecución del script ---
token = get_token()
if token:
    delete_all_parcels(token)