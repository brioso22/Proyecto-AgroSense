import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/logo.png'; // coloca tu logo en /src/assets/
import { Link } from 'react-router-dom'; // Agrega este import si no lo tienes

// Componente para centrar el mapa
function CenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Componente para manejar errores
function MapErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        Error al cargar el mapa. Verifica tu conexión a internet o intenta recargar la página.
      </div>
    );
  }

  return children;
}

export default function Mapa() {
  const [mapCenter, setMapCenter] = useState([13.6929, -89.2182]); // Centro inicial en San Salvador
  const [mapType, setMapType] = useState('standard'); // 'standard' o 'satellite'
  const [userLocation, setUserLocation] = useState(null);
  const [showPanel, setShowPanel] = useState(false); // Panel lateral para información
  const [searchQuery, setSearchQuery] = useState(''); // Búsqueda de lugares
  const [filteredMarkers, setFilteredMarkers] = useState([]); // Marcadores filtrados

  // Datos simulados de parcelas (puedes conectar con API real)
  const parcelas = [
    { id: 1, name: 'Parcela 1', position: [13.6929, -89.2182], humidity: 65, temperature: 28, ph: 6.8 },
    { id: 2, name: 'Parcela 2', position: [13.7000, -89.2200], humidity: 70, temperature: 26, ph: 7.0 },
    { id: 3, name: 'Parcela 3', position: [13.6850, -89.2100], humidity: 60, temperature: 30, ph: 6.5 },
  ];

  // Función para obtener la ubicación del usuario
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso a la ubicación.');
        }
      );
    } else {
      alert('La geolocalización no es soportada por este navegador.');
    }
  };

  // Función para buscar y filtrar marcadores
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = parcelas.filter(parcela =>
        parcela.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMarkers(filtered);
      if (filtered.length > 0) {
        setMapCenter(filtered[0].position);
      }
    } else {
      setFilteredMarkers([]);
    }
  };

  // URLs de capas de mapa
  const tileLayers = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };

  return (
    <MapErrorBoundary>
      <div className="container-fluid p-0" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        {/* Controles superiores mejorados */}
        <div className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm border-bottom">
          <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="AgroSense" width="40" height="40" className="me-2 rounded" />
            <h4 className="mb-0 text-success fw-bold" style={{ cursor: 'pointer' }}>Mapa Interactivo - AgroSense 🌍</h4>
          </Link>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar parcela..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{ width: '150px' }}
            />
            <button className="btn btn-outline-primary btn-sm" onClick={handleSearch}>
              🔍
            </button>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
            >
              {mapType === 'standard' ? '🛰️ Satelital' : '🗺️ Estándar'}
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={getUserLocation}
            >
              📍 Mi Ubicación
            </button>
            <button
              className="btn btn-info btn-sm"
              onClick={() => setShowPanel(!showPanel)}
            >
              📊 Panel
            </button>
          </div>
        </div>

        {/* Contenedor del mapa y panel lateral */}
        <div className="d-flex" style={{ height: 'calc(100vh - 80px)' }}>
          {/* Panel lateral */}
          {showPanel && (
            <div className="bg-white shadow p-3" style={{ width: '300px', overflowY: 'auto' }}>
              <h5 className="text-success fw-bold">📊 Información de Parcelas</h5>
              <ul className="list-group list-group-flush">
                {parcelas.map(parcela => (
                  <li key={parcela.id} className="list-group-item">
                    <strong>{parcela.name}</strong><br />
                    Humedad: {parcela.humidity}% | Temp: {parcela.temperature}°C | pH: {parcela.ph}<br />
                    <button
                      className="btn btn-sm btn-outline-primary mt-1"
                      onClick={() => setMapCenter(parcela.position)}
                    >
                      Centrar en Mapa
                    </button>
                  </li>
                ))}
              </ul>
              {filteredMarkers.length > 0 && (
                <div className="mt-3">
                  <h6>Resultados de Búsqueda:</h6>
                  <ul className="list-group list-group-flush">
                    {filteredMarkers.map(marker => (
                      <li key={marker.id} className="list-group-item">
                        {marker.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Mapa mejorado */}
          <div className="flex-grow-1 position-relative">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              zoomControl={true}
              scrollWheelZoom={true}
              aria-label="Mapa interactivo de AgroSense"
            >
              <TileLayer
                url={tileLayers[mapType]}
                attribution={mapType === 'standard' ? '&copy; OpenStreetMap contributors' : '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}
              />
              
              {/* Marcadores de parcelas */}
              {parcelas.map(parcela => (
                <Marker key={parcela.id} position={parcela.position}>
                  <Popup>
                    <div className="text-center">
                      <img src={logo} alt="Logo AgroSense" style={{ width: '40px', height: '40px', marginBottom: '5px', borderRadius: '5px' }} />
                      <strong>{parcela.name} 🌱</strong><br />
                      Humedad: {parcela.humidity}% | Temperatura: {parcela.temperature}°C<br />
                      pH: {parcela.ph} | Estado: Óptimo
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Marcador de ubicación del usuario */}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center">
                      <img src={logo} alt="Logo AgroSense" style={{ width: '50px', height: '50px', marginBottom: '10px', borderRadius: '5px' }} />
                      <strong>Tu Ubicación 📍</strong><br />
                      Lat: {userLocation[0].toFixed(4)}<br />
                      Lng: {userLocation[1].toFixed(4)}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Componente para centrar el mapa */}
              <CenterMap center={mapCenter} />
            </MapContainer>
          </div>
        </div>
      </div>
    </MapErrorBoundary>
  );
}