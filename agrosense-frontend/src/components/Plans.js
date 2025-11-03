import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Modal, Form, Alert, Spinner, Badge, Container } from 'react-bootstrap';

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

  const USERPLAN_URL = 'http://127.0.0.1:8000/api/userplans/';
  const PARCEL_URL = 'http://127.0.0.1:8000/api/parcels/';

  const staticPlans = [
    { id: 1, name: 'Plan Básico', description: 'Monitoreo básico, alertas meteorológicas y reportes semanales.', price: 19.99, coverage_area_km2: 5 },
    { id: 2, name: 'Plan Premium', description: 'Monitoreo avanzado, análisis de suelo, y reportes diarios.', price: 49.99, coverage_area_km2: 20 },
    { id: 3, name: 'Plan Profesional', description: 'Análisis en tiempo real, imágenes satelitales y soporte técnico 24/7.', price: 99.99, coverage_area_km2: 50 },
  ];

  useEffect(() => {
    const fetchUserPlan = async () => {
      const token = localStorage.getItem('authToken');
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
  }, []);

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowModal(true);
  };

  // Crear plan + parcela
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('⚠️ Debes iniciar sesión para adquirir un plan.');
      setAlertVariant('warning');
      return;
    }

    setSubmitting(true);
    try {
      // 1️⃣ Crear el plan del usuario
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

      // 2️⃣ Crear la parcela asociada al usuario
      await axios.post(
        PARCEL_URL,
        {
          name: `${selectedPlan.name} - Parcela`, // nombre de la parcela
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
    const token = localStorage.getItem('authToken');
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

      {/* Modal de pago */}
      <Modal show={showPayment} onHide={() => setShowPayment(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>💳 Pago Seguro</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Estás a punto de adquirir el plan <strong>{selectedPlan?.name}</strong>.</p>
          <p className="fs-5">Monto total: <Badge bg="success">${selectedPlan?.price}</Badge></p>
          <p className="text-muted">Simulación de pago (sin pasarela real).</p>
          <Button variant="success" onClick={handlePaymentSuccess} className="w-100">Proceder al Pago</Button>
        </Modal.Body>
      </Modal>

      {/* Modal de ubicación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>📍 Registrar Ubicación y Cultivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Latitud</Form.Label>
              <Form.Control type="number" value={formData.location_latitude} onChange={e => setFormData({ ...formData, location_latitude: e.target.value })} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Longitud</Form.Label>
              <Form.Control type="number" value={formData.location_longitude} onChange={e => setFormData({ ...formData, location_longitude: e.target.value })} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Área (m²)</Form.Label>
              <Form.Control type="number" value={formData.area_m2} onChange={e => setFormData({ ...formData, area_m2: e.target.value })} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cultivo</Form.Label>
              <Form.Control type="text" value={formData.crop_name} onChange={e => setFormData({ ...formData, crop_name: e.target.value })} placeholder="Ej: Maíz" required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de siembra</Form.Label>
              <Form.Control type="date" value={formData.sowing_date} onChange={e => setFormData({ ...formData, sowing_date: e.target.value })} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha estimada de cosecha</Form.Label>
              <Form.Control type="date" value={formData.expected_harvest_date} onChange={e => setFormData({ ...formData, expected_harvest_date: e.target.value })} required/>
            </Form.Group>
            <Button type="submit" variant="success" className="w-100" disabled={submitting}>
              {submitting ? <Spinner as="span" animation="border" size="sm" /> : 'Confirmar y Crear Parcela'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
