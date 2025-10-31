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
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState('info');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = 'http://127.0.0.1:8000/api/plans/';
  const USERPLAN_URL = 'http://127.0.0.1:8000/api/userplans/';

  // Cargar planes y plan de usuario
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const plansRes = await axios.get(API_URL);
        let userPlanRes = null;

        if (token) {
          const res = await axios.get(USERPLAN_URL, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Si DRF devuelve lista o un solo objeto
          userPlanRes = Array.isArray(res.data) ? res.data[0] : res.data;
        }

        setPlans(plansRes.data);
        setUserPlan(userPlanRes || null);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setMessage('Error al cargar los datos. Inténtalo de nuevo.');
        setAlertVariant('danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar compra
  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  // Cancelar plan
  const handleCancelPlan = async () => {
    const token = localStorage.getItem('authToken');
    if (!userPlan) return;

    if (!window.confirm('¿Seguro que deseas cancelar tu plan actual? Esta acción no se puede deshacer.')) return;

    setSubmitting(true);
    try {
      await axios.delete(`${USERPLAN_URL}${userPlan.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPlan(null);
      setMessage('Plan cancelado exitosamente.');
      setAlertVariant('success');
    } catch (err) {
      console.error(err);
      setMessage('Error al cancelar el plan. Inténtalo de nuevo.');
      setAlertVariant('danger');
    } finally {
      setSubmitting(false);
    }
  };

  // Simulación de pago exitoso
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowModal(true);
  };

  // Cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Crear plan de usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Debes iniciar sesión para adquirir un plan.');
      setAlertVariant('warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        USERPLAN_URL,
        {
          plan: selectedPlan.id,
          location_latitude: parseFloat(formData.location_latitude),
          location_longitude: parseFloat(formData.location_longitude),
          area_m2: parseFloat(formData.area_m2)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserPlan(res.data);
      setMessage('✅ Plan adquirido exitosamente. Se ha creado tu parcela.');
      setAlertVariant('success');
      setShowModal(false);
      setFormData({ location_latitude: '', location_longitude: '', area_m2: '' });
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al adquirir el plan. Verifica los datos o intenta de nuevo.');
      setAlertVariant('danger');
    } finally {
      setSubmitting(false);
    }
  };

  const dismissAlert = () => setMessage(null);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
        <span className="ms-2">Cargando planes...</span>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-success text-center mb-4 fw-bold">🌿 Gestión de Planes de Parcelas</h2>

      {message && (
        <Alert variant={alertVariant} dismissible onClose={dismissAlert} className="text-center">
          {message}
        </Alert>
      )}

      {/* Plan actual */}
      <Row className="mb-4">
        <Col xs={12}>
          <h4 className="text-primary mb-3">📦 Tu Plan Actual</h4>
          {userPlan ? (
            <Card className="shadow-sm border-success bg-light">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <Card.Title className="text-success">{userPlan.plan_name}</Card.Title>
                    <p className="mb-1"><strong>Plan ID:</strong> {userPlan.plan}</p>
                    <p className="mb-1"><strong>Ubicación:</strong> Lat {userPlan.location_latitude}, Lon {userPlan.location_longitude}</p>
                    <p className="mb-1"><strong>Área:</strong> {userPlan.area_m2} m²</p>
                  </Col>
                  <Col xs={12} md={4} className="text-end">
                    <Button
                      variant="outline-danger"
                      onClick={handleCancelPlan}
                      disabled={submitting}
                      className="w-100 w-md-auto"
                    >
                      {submitting ? <Spinner as="span" animation="border" size="sm" /> : 'Cancelar Plan'}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="secondary" className="text-center">
              No tienes ningún plan activo actualmente. ¡Elige uno de los disponibles!
            </Alert>
          )}
        </Col>
      </Row>

      {/* Planes disponibles */}
      <Row>
        <Col xs={12}>
          <h4 className="text-success mb-3">🛒 Planes Disponibles</h4>
          <Row>
            {plans
              .filter(plan => !userPlan || plan.id !== userPlan.plan)
              .map(plan => (
                <Col xs={12} sm={6} lg={4} key={plan.id} className="mb-4">
                  <Card className="shadow-sm h-100 border-0" style={{ borderRadius: '10px' }}>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-success fw-bold">{plan.name}</Card.Title>
                      <Card.Text className="flex-grow-1">{plan.description}</Card.Text>
                      <div className="mb-3">
                        <p className="mb-1"><strong>Área:</strong> {plan.coverage_area_km2} km²</p>
                        <p className="mb-0"><strong>Precio:</strong> <Badge bg="primary">${plan.price}</Badge></p>
                      </div>
                      <Button
                        variant="success"
                        onClick={() => handlePurchase(plan)}
                        className="w-100 mt-auto"
                        disabled={!!userPlan}
                      >
                        {userPlan ? 'Ya tienes un plan' : 'Adquirir'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Col>
      </Row>

      {/* Modal de pago */}
      <Modal show={showPayment} onHide={() => setShowPayment(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>💳 Pago Seguro</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Estás a punto de adquirir el plan <strong>{selectedPlan?.name}</strong>.</p>
          <p className="fs-5">Monto total: <Badge bg="success">${selectedPlan?.price}</Badge></p>
          <p className="text-muted">Esta es una simulación de pago. En un entorno real, integrarías con un gateway de pago.</p>
          <Button variant="success" onClick={handlePaymentSuccess} className="w-100">
            Proceder al Pago
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de ubicación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>📍 Registrar Ubicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Latitud</Form.Label>
                  <Form.Control
                    name="location_latitude"
                    type="number"
                    step="0.0001"
                    value={formData.location_latitude}
                    onChange={handleChange}
                    required
                    placeholder="Ej: -12.0464"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Longitud</Form.Label>
                  <Form.Control
                    name="location_longitude"
                    type="number"
                    step="0.0001"
                    value={formData.location_longitude}
                    onChange={handleChange}
                    required
                    placeholder="Ej: -77.0428"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Área (m²)</Form.Label>
              <Form.Control
                name="area_m2"
                type="number"
                value={formData.area_m2}
                onChange={handleChange}
                required
                placeholder="Ej: 1000"
              />
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
