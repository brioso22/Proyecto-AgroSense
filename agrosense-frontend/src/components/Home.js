import React from 'react'; // Importar React es buena práctica
import { Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import logo from './assets/logo.png';
import Dashboard from './Dashboard';

export default function Home() {
    const navigate = useNavigate();

    // Función para manejar el logout
    const handleLogout = () => {
        // Limpiar el token de autenticación
        localStorage.removeItem('authToken');

        // Redirigir a la página de login o a la ruta principal
        // El endpoint '/logout' no suele ser una ruta de frontend válida,
        // por lo general se redirige a la página de inicio de sesión ('/')
        navigate('/logout'); 
    };

    return (
        // 1. Contenedor principal para la estructura de la página
        // d-flex flex-column y min-vh-100 aseguran que el footer esté abajo.
        <div className="min-vh-100 d-flex flex-column bg-light">

            {/* Navbar mejorado */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div className="container"> 
                    {/* Contenido de la marca y logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/home">
                        <img src={logo} alt="AgroSense Logo" style={{ height: '30px', marginRight: '8px' }} />
                        <span className="fw-bold text-success">AgroSense</span>
                    </Link>
                    
                    {/* Botón Toggler para móviles */}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Elementos colapsables (Links y Logout) */}
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav align-items-center"> {/* align-items-center para centrar el botón */}
                            <li className="nav-item">
                                <Link className="nav-link text-success fw-semibold" to="/perfil">Perfil</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-success fw-semibold" to="/mapa">Mapa</Link>
                            </li>
                            <li className="nav-item ms-lg-3"> {/* Margen solo en pantallas grandes */}
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleLogout}
                                    title="Cerrar sesión"
                                >
                                    🚪 Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div> 
            </nav>

            {/* Contenido principal */}
            <main className="container flex-grow-1 py-3 py-md-5">
                <div className="text-center mb-4 mb-md-5">
                    <h1 className="fw-bold text-success display-4 display-md-3 mb-3">Bienvenido a AgroSense 🌿</h1>
                    <p className="text-muted fs-5 fs-md-4 lead">
                        Monitorea, analiza y gestiona tus cultivos de forma inteligente con tecnología avanzada.
                    </p>
                </div>

                {/* Secciones de acceso */}
                <div className="row g-3 g-md-4 justify-content-center mb-4 mb-md-5">
                    <div className="col-12 col-sm-6 col-md-4">
                        <div className="card shadow-sm border-0 h-100 text-center bg-gradient-success text-white" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                            <div className="card-body d-flex flex-column p-4">
                                <div className="mb-3" style={{ fontSize: '3rem' }}>👤</div>
                                <h5 className="card-title fw-bold">Perfil de Usuario</h5>
                                <p className="card-text flex-grow-1">
                                    Accede a tu información y configuración personal.
                                </p>
                                <Link to="/perfil" className="btn btn-light w-100 mt-auto fw-semibold">Ir al Perfil</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-md-4">
                        <div className="card shadow-sm border-0 h-100 text-center bg-gradient-info text-white" style={{ background: 'linear-gradient(135deg, #007bff, #17a2b8)' }}>
                            <div className="card-body d-flex flex-column p-4">
                                <div className="mb-3" style={{ fontSize: '3rem' }}>🗺️</div>
                                <h5 className="card-title fw-bold">Mapa Interactivo</h5>
                                <p className="card-text flex-grow-1">
                                    Visualiza tus terrenos y sensores en tiempo real.
                                </p>
                                <Link to="/mapa" className="btn btn-light w-100 mt-auto fw-semibold">Abrir Mapa</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard integrado */}
                <div className="mt-4 mt-md-5">
                    <h4 className="fw-bold text-success mb-3 text-center display-5 display-md-4">Panel de Resumen 📈</h4>
                    <div className="bg-white shadow rounded border p-2 p-md-3">
                        <Dashboard />
                    </div>
                    <p className="text-muted mt-3 text-center small">
                        Vista rápida del rendimiento de tus cultivos. Actualización automática cada 5 minutos.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white text-center py-3 mt-auto shadow-sm">
                <small className="text-muted fw-semibold">
                    © {new Date().getFullYear()} AgroSense | Inteligencia para el campo 🌱 | Desarrollado con ❤️ para agricultores
                </small>
            </footer>
        </div>
    );
}