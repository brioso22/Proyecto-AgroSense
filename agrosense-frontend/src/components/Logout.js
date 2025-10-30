// src/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Eliminar token y datos del usuario
    localStorage.removeItem('authToken');

    // Esperar un momento para mostrar mensaje y luego redirigir
    const timer = setTimeout(() => {
      navigate('/'); // redirige al Home o Login
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <Spinner animation="border" variant="success" className="mb-3" />
      <h5 className="text-success fw-bold">Cerrando sesión...</h5>
      <p className="text-muted small">Serás redirigido en un momento.</p>
    </div>
  );
}
