import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Table, Spinner, Button, Alert } from 'react-bootstrap';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://127.0.0.1:8000/api/parcels/';
  const TOKEN_URL = 'http://127.0.0.1:8000/api/token/';
  const USERNAME = 'yesy';
  const PASSWORD = 'Yesy_Hermosa1999';

  // Función para obtener token
  const getToken = async () => {
    try {
      const res = await axios.post(TOKEN_URL, { username: USERNAME, password: PASSWORD });
      const token = res.data.access;
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      console.error('❌ Error al obtener token:', error);
      setError('Error al autenticar. Verifica tus credenciales.');
      return null;
    }
  };

  // Función para obtener datos
  const fetchData = async () => {
    setLoadingData(true);
    setError(null);
    try {
      let token = localStorage.getItem('authToken');
      if (!token) {
        token = await getToken();
        if (!token) return;
      }

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await getToken();
        if (newToken) fetchData();
      } else {
        console.error('Error al obtener datos:', error);
        setError('Error al cargar datos. Intenta nuevamente.');
      }
    } finally {
      setLoadingData(false);
    }
  };

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  // Cálculos de promedios con validación
  const promedioRiegos = data.length > 0 ? (data.reduce((acc, d) => acc + (d.irrigation_count || 0), 0) / data.length).toFixed(1) : '0.0';
  const promedioPH = data.length > 0 ? (data.reduce((acc, d) => acc + (d.soil_ph || 0), 0) / data.length).toFixed(2) : '0.00';
  const promedioTemperatura = data.length > 0 ? (data.reduce((acc, d) => acc + (d.ambient_temperature || 0), 0) / data.length).toFixed(1) : '0.0';
  const promedioHumedad = data.length > 0 ? (data.reduce((acc, d) => acc + (d.humidity || 0), 0) / data.length).toFixed(1) : '0.0';

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-ES'); // Formato español
  };

  // Función para mostrar weather_info de manera legible (asumiendo es un objeto con campos como 'description', 'temp', etc.)
  const formatWeather = (weather) => {
    if (!weather) return '—';
    try {
      const parsed = typeof weather === 'string' ? JSON.parse(weather) : weather;
      return parsed.description || JSON.stringify(parsed); // Muestra descripción si existe, sino el JSON
    } catch {
      return '—';
    }
  };

  // Función para generar recomendaciones basadas en promedios
  const generateRecommendations = () => {
    const recommendations = [];
    const ph = parseFloat(promedioPH);
    const humidity = parseFloat(promedioHumedad);
    const temp = parseFloat(promedioTemperatura);

    if (ph > 7.5) {
      recommendations.push('⚠️ El pH promedio del suelo es alto (>7.5). Considera agregar materia orgánica ácida o enmiendas para reducirlo.');
    } else if (ph < 6.5) {
      recommendations.push('⚠️ El pH promedio del suelo es bajo (<6.5). Aplica cal o enmiendas básicas para elevarlo.');
    } else {
      recommendations.push('✅ El pH promedio del suelo está en rango óptimo (6.5-7.5).');
    }

    if (humidity < 40) {
      recommendations.push('💧 La humedad promedio es baja (<40%). Aumenta los riegos o verifica el sistema de irrigación.');
    } else if (humidity > 80) {
      recommendations.push('⚠️ La humedad promedio es alta (>80%). Reduce los riegos para evitar enfermedades fúngicas.');
    } else {
      recommendations.push('✅ La humedad promedio está en rango adecuado (40-80%).');
    }

    if (temp > 30) {
      recommendations.push('🌡️ La temperatura ambiente promedio es alta (>30°C). Proporciona sombra o riego adicional para proteger los cultivos.');
    } else if (temp < 10) {
      recommendations.push('❄️ La temperatura ambiente promedio es baja (<10°C). Considera protección contra heladas.');
    } else {
      recommendations.push('✅ La temperatura ambiente promedio es favorable.');
    }

    if (parseFloat(promedioRiegos) < 5) {
      recommendations.push('🚿 El promedio de riegos automatizados es bajo. Verifica la configuración de los sensores.');
    } else {
      recommendations.push('✅ Los riegos automatizados están en buen nivel.');
    }

    return recommendations;
  };

  return (
    <div 
      className="container-fluid mt-2" 
      style={{ 
        backgroundColor: '#f8f9fa', 
        height: 'auto', // Cambiado de minHeight: '100vh' para adaptarse al iframe
        width: '100%', 
        padding: '0.5rem' // Reducido padding para compactar
      }}
    >
      <h2 className="text-center mb-3 text-success" style={{ fontWeight: 'bold', fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}>
        🌱 Dashboard de AgroSense
      </h2>

      {error && (
        <Alert variant="danger" className="text-center mb-3">
          {error}
        </Alert>
      )}

      {loadingData ? (
        <div className="text-center my-3">
          <Spinner animation="border" variant="success" />
          <p className="mt-1 text-muted small">Cargando datos...</p>
        </div>
      ) : (
        <>
          {/* Botón de refresh más pequeño */}
          <div className="text-end mb-2">
            <Button variant="outline-success" size="sm" onClick={fetchData} disabled={loadingData}>
              🔄 Actualizar
            </Button>
          </div>

          {/* Estadísticas rápidas compactas */}
          <Row className="mb-3">
            <Col xs={6} sm={3} className="mb-2">
              <Card className="text-center shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', color: 'white' }}>
                <Card.Body className="p-2">
                  <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '5px' }}>🌱</div>
                  <h6 style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Total de Parcelas</h6>
                  <h4 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>{data.length}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3} className="mb-2">
              <Card className="text-center shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #007bff, #17a2b8)', color: 'white' }}>
                <Card.Body className="p-2">
                  <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '5px' }}>💧</div>
                  <h6 style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Riegos Automatizados</h6>
                  <h4 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>{promedioRiegos}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3} className="mb-2">
              <Card className="text-center shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #ffc107, #fd7e14)', color: 'white' }}>
                <Card.Body className="p-2">
                  <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '5px' }}>🧪</div>
                  <h6 style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>pH Promedio del Suelo</h6>
                  <h4 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>{promedioPH}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3} className="mb-2">
              <Card className="text-center shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #dc3545, #e83e8c)', color: 'white' }}>
                <Card.Body className="p-2">
                  <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '5px' }}>🌡️</div>
                  <h6 style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Temperatura Ambiente</h6>
                  <h4 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>{promedioTemperatura} °C</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={6} sm={3} className="mb-2">
              <Card className="text-center shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #6f42c1, #e83e8c)', color: 'white' }}>
                <Card.Body className="p-2">
                  <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '5px' }}>💦</div>
                  <h6 style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Humedad Promedio</h6>
                  <h4 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>{promedioHumedad} %</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={9} className="mb-2">
              <Card className="text-center shadow-sm border-success" style={{ backgroundColor: '#d4edda' }}>
                <Card.Body className="p-2">
                  <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '5px', color: '#28a745' }}>🕒</div>
                  <h6 style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Última actualización</h6>
                  <p style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>{new Date().toLocaleString('es-ES')}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recomendaciones compactas */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-success text-white py-2">
              <small className="fw-bold">📋 Recomendaciones Agrícolas</small>
            </Card.Header>
            <Card.Body className="p-2">
              <ul className="list-unstyled mb-0">
                {generateRecommendations().map((rec, index) => (
                  <li key={index} className="mb-1 small" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>

         
        </>
      )}
    </div>
  );
}
