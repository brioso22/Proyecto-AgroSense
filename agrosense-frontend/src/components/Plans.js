import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Modal, Form, Alert, Spinner, Badge, Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

export default function Plans() {
  const [expanded, setExpanded] = useState(false);
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

  const USERPLAN_URL = 'http://192.168.0.12:8000/api/userplans/';
  const PARCEL_URL = 'http://192.168.0.12:8000/api/parcels/';

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
      const lat = parseFloat(formData.location_latitude);
      const lon = parseFloat(formData.location_longitude);
      const area = parseFloat(formData.area_m2);
      if (isNaN(lat) || isNaN(lon) || isNaN(area) || !formData.sowing_date || !formData.expected_harvest_date) {
        throw new Error('Todos los campos requeridos deben ser válidos. Verifica latitud, longitud, área y fechas.');
      }

      // Borrar plan existente
      const existingPlans = await axios.get(USERPLAN_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(existingPlans.data) && existingPlans.data.length > 0) {
        await Promise.all(existingPlans.data.map(plan =>
          axios.delete(`${USERPLAN_URL}${plan.id}/`, { headers: { Authorization: `Bearer ${token}` } })
        ));
      }

      // Borrar parcela existente
      const existingParcels = await axios.get(PARCEL_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(existingParcels.data) && existingParcels.data.length > 0) {
        await Promise.all(existingParcels.data.map(parcel =>
          axios.delete(`${PARCEL_URL}${parcel.id}/`, { headers: { Authorization: `Bearer ${token}` } })
        ));
      }

      // Crear nuevo plan
      const planRes = await axios.post(
        USERPLAN_URL,
        {
          plan_name: selectedPlan.name,
          plan_description: selectedPlan.description,
          plan_price: selectedPlan.price,
          plan_coverage_area_km2: selectedPlan.coverage_area_km2,
          location_latitude: lat,
          location_longitude: lon,
          area_m2: area,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserPlan(planRes.data);

      // Crear nueva parcela
      await axios.post(
        PARCEL_URL,
        {
          name: `${selectedPlan.name} - Parcela`,
          latitude: lat,
          longitude: lon,
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
      console.error('Error en handleSubmit:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error desconocido al adquirir el plan o crear la parcela.';
      setMessage(`❌ ${errorMessage}`);
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
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navbar */}
      <Navbar expanded={expanded} expand="lg" bg="white" variant="light" className="shadow-sm sticky-top py-2 mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
            <img src={logo} alt="AgroSense Logo" style={{ height: '35px', marginRight: '10px' }} />
            <span className="fw-bold text-success fs-5">AgroSense</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link as={Link} to="/Mapa" className="text-success fw-semibold" onClick={() => setExpanded(false)}>Mapa</Nav.Link>
              <Nav.Link as={Link} to="/ChatFAQSupport" className="text-success fw-semibold" onClick={() => setExpanded(false)}>Chat y Soporte</Nav.Link>
            </Nav>
            <div className="d-flex align-items-center ms-auto">
              <Link to="/Perfil" onClick={() => setExpanded(false)}>
                <img
                  src={userPhoto || '/default-avatar.png'}
                  alt="Usuario"
                  className="rounded-circle border border-2"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

        {/* Modal de Pago */}
        <Modal show={showPayment} onHide={() => setShowPayment(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-success">💳 Procesar Pago</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Estás a punto de adquirir el plan <strong>{selectedPlan?.name}</strong> por <strong>${selectedPlan?.price}</strong>.</p>
            <p>Simulando proceso de pago...</p>
            <Button variant="success" onClick={handlePaymentSuccess} className="w-100">
              Confirmar Pago
            </Button>
          </Modal.Body>
        </Modal>

        {/* Modal de Formulario */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-success">📝 Detalles de la Parcela</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latitud</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      value={formData.location_latitude}
                      onChange={(e) => setFormData({ ...formData, location_latitude: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitud</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      value={formData.location_longitude}
                      onChange={(e) => setFormData({ ...formData, location_longitude: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Área (m²)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.area_m2}
                  onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Cultivo</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.crop_name}
                  onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Siembra</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.sowing_date}
                      onChange={(e) => setFormData({ ...formData, sowing_date: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Esperada de Cosecha</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.expected_harvest_date}
                      onChange={(e) => setFormData({ ...formData, expected_harvest_date: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="success" type="submit" className="w-100" disabled={submitting}>
                {submitting ? 'Procesando...' : 'Confirmar y Crear Parcela'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>

      {/* Footer */}
      <footer className="bg-white text-center py-3 mt-auto shadow-sm">
        <small className="text-muted fw-semibold">
          © {new Date().getFullYear()} AgroSense | Gestión de Planes | Desarrollado con ❤️
        </small>
      </footer>
    </div>
  );
}
