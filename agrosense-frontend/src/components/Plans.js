import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Modal, Form, Alert, Spinner, Badge, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png'; // relativa a components


export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    location_latitude: '',
    location_longitude: '',
    area_m2: '',
    crop_name: '',
    sowing_date: '',
    expected_harvest_date: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState('info');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const USERPLAN_URL = 'http://127.0.0.1:8000/api/userplans/';
  const PARCEL_URL = 'http://127.0.0.1:8000/api/parcels/';

  const staticPlans = [
    { id: 1, name: 'Plan Básico', description: 'Monitoreo básico, alertas meteorológicas y reportes semanales.', price: 19.99, coverage_area_km2: 5 },
    { id: 2, name: 'Plan Premium', description: 'Monitoreo avanzado, análisis de suelo, y reportes diarios.', price: 49.99, coverage_area_km2: 20 },
    { id: 3, name: 'Plan Profesional', description: 'Análisis en tiempo real, imágenes satelitales y soporte técnico 24/7.', price: 99.99, coverage_area_km2: 50 },
  ];

  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');
  const userPhoto = localStorage.getItem(`photo_${username}`) || '/default-avatar.png';

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!token) {
        setPlans(staticPlans);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(USERPLAN_URL, { headers: { Authorization: `Bearer ${token}` } });
        const planData = Array.isArray(res.data) ? res.data[0] : res.data;
        setUserPlan(planData || null);
      } catch (err) {
        console.error('Error al obtener plan del usuario:', err);
      } finally {
        setPlans(staticPlans);
        setLoading(false);
      }
    };
    fetchUserPlan();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('⚠️ Debes iniciar sesión para adquirir un plan.');
      setAlertVariant('warning');
      return;
    }
    setSubmitting(true);
    try {
      const planRes = await axios.post(
        USERPLAN_URL,
        {
          plan_name: selectedPlan.name,
          plan_description: selectedPlan.description,
          plan_price: selectedPlan.price,
          plan_coverage_area_km2: selectedPlan.coverage_area_km2,
          location_latitude: parseFloat(formData.location_latitude),
          location_longitude: parseFloat(formData.location_longitude),
          area_m2: parseFloat(formData.area_m2),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserPlan(planRes.data);

      await axios.post(
        PARCEL_URL,
        {
          name: `${selectedPlan.name} - Parcela`,
          latitude: parseFloat(formData.location_latitude),
          longitude: parseFloat(formData.location_longitude),
          crop_name: formData.crop_name || 'Cultivo genérico',
          sowing_date: formData.sowing_date,
          expected_harvest_date: formData.expected_harvest_date,
          irrigation_count: 0,
          soil_ph: null,
          ambient_temperature: null,
          humidity: null,
          weather_info: {}
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Plan adquirido y parcela creada exitosamente.');
      setAlertVariant('success');
      setShowModal(false);
      setFormData({ location_latitude: '', location_longitude: '', area_m2: '', crop_name: '', sowing_date: '', expected_harvest_date: '' });

    } catch (err) {
      console.error(err.response?.data || err);
      setMessage('❌ Error al adquirir el plan o crear la parcela.');
      setAlertVariant('danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPlan = async () => {
    if (!token || !userPlan) return;
    if (!window.confirm('¿Seguro que deseas cancelar tu plan actual?')) return;

    setDeleting(true);
    try {
      await axios.delete(`${USERPLAN_URL}${userPlan.id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setUserPlan(null);
      setMessage('🗑️ Tu plan ha sido cancelado correctamente.');
      setAlertVariant('info');
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage('❌ Error al cancelar el plan.');
      setAlertVariant('danger');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="success" /><span className="ms-2">Cargando planes...</span>
    </Container>
  );

  return (
    <>
      {/* Navbar */}
<nav className="navbar navbar-expand-lg navbar-white bg-white shadow-sm sticky-top py-2 mb-4">
  <div className="container">
    {/* Logo */}
    <Link className="navbar-brand d-flex align-items-center" to="/home">
      <img src={logo} alt="AgroSense Logo" style={{ height: '35px', marginRight: '10px' }} />
      <span className="fw-bold text-success fs-5">AgroSense</span>
    </Link>

    {/* Botón colapsable para mobile */}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link text-success fw-semibold" to="/Mapa">Mapa</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-success fw-semibold" to="/ChatFAQSupport">Chat y Soporte</Link>
        </li>
      </ul>

      {/* Foto de usuario */}
      <div className="d-flex align-items-center ms-auto">
        <Link to="/Perfil">
          <img
            src={userPhoto}
            alt="Usuario"
            className="rounded-circle border border-2"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
        </Link>
      </div>
    </div>
  </div>
</nav>


      <Container className="mt-4 mb-4">
        <h2 className="text-success text-center mb-4 fw-bold">🌿 Gestión de Planes de Parcelas</h2>

        {message && <Alert variant={alertVariant} dismissible onClose={() => setMessage(null)} className="text-center">{message}</Alert>}

        {/* Plan actual */}
        <Row className="mb-4">
          <Col xs={12}>
            <h4 className="text-primary mb-3">📦 Tu Plan Actual</h4>
            {userPlan ? (
              <Card className="shadow-sm border-success bg-light">
                <Card.Body>
                  <Card.Title className="text-success">{userPlan.plan_name}</Card.Title>
                  <p><strong>Precio:</strong> ${userPlan.plan_price}</p>
                  <p><strong>Área:</strong> {userPlan.area_m2} m²</p>
                  <p><strong>Ubicación:</strong> Lat {userPlan.location_latitude}, Lon {userPlan.location_longitude}</p>
                  <Button variant="outline-danger" className="mt-2" onClick={handleCancelPlan} disabled={deleting}>
                    {deleting ? 'Cancelando...' : 'Cancelar Plan'}
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="secondary" className="text-center">No tienes ningún plan activo actualmente. ¡Elige uno de los disponibles!</Alert>
            )}
          </Col>
        </Row>

        {/* Planes disponibles */}
        <Row>
          <h4 className="text-success mb-3">🛒 Planes Disponibles</h4>
          {plans.map((plan) => (
            <Col xs={12} sm={6} lg={4} key={plan.id} className="mb-4">
              <Card className="shadow-sm h-100 border-0">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-success fw-bold">{plan.name}</Card.Title>
                  <Card.Text>{plan.description}</Card.Text>
                  <p><strong>Cobertura:</strong> {plan.coverage_area_km2} km²</p>
                  <p><strong>Precio:</strong> <Badge bg="primary">${plan.price}</Badge></p>
                  <Button variant="success" onClick={() => handlePurchase(plan)} disabled={!!userPlan}>
                    {userPlan ? 'Ya tienes un plan activo' : 'Adquirir'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modals... (igual que antes) */}
      </Container>
    </>
  );
}
