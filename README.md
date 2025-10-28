# AgroSense

**AgroSense** es una plataforma innovadora diseñada para **automatizar y monitorear procesos de cultivo**. El proyecto permite a los usuarios gestionar huertos caseros y parcelas agrícolas de mayor escala, con funcionalidades que incluyen control de humedad, riego automatizado, dispersión de fertilizantes/pesticidas, visualización de cultivos mediante mapas y cámaras, y monitoreo basado en sensores y datos climáticos simulados.

El sistema está desarrollado con **Django** en el backend y **Angular** en el frontend. Los datos de los cultivos se simulan para demostrar el flujo de información desde sensores hasta la aplicación web.

---

## 🔹 Funcionalidades principales

### Usuario / Dashboard
- Registro e inicio de sesión de usuarios.
- Dashboard web y móvil responsivo con información de cultivos en tiempo real.
- Visualización de alertas y estado de parcelas.
- Consulta de planes contratados y gestión de suscripciones.

### Modelos de cultivo
1. **Plan 1 (Huertos caseros):** Control de humedad y riego automatizado.
2. **Plan 2 (Cultivos medianos):** Riego automatizado con dispersión de fertilizantes/pesticidas.
3. **Plan 3 (Escala avanzada):** Sensores avanzados, imágenes periódicas, drones (simulados) y automatización según clima y estado del cultivo.

### Mapeo y visualización
- Mapas interactivos de parcelas con estado de cultivo.
- Visualización de imágenes periódicas de las parcelas (simulado).
- Alertas y notificaciones en tiempo real.

### Simulación de datos
- Generador de datos de telemetría para probar la plataforma.
- Escenarios simulados de crecimiento, sequía o plagas.
- Integración de datos simulados con el dashboard y alertas.

---

## ⚙️ Tecnologías utilizadas
- **Backend:** Django, Django REST Framework
- **Frontend:** Angular, Angular Material / Bootstrap
- **Base de datos:** SQLite (para desarrollo, puede adaptarse a PostgreSQL)
- **Mapas:** Google Maps API
- **Control de versiones:** Git + GitHub

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/brioso22/Proyecto-AgroSense.git
cd Proyecto-AgroSense
