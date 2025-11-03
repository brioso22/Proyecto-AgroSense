import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/logo.png';
import Dashboard from './Dashboard';

export default function Home() {
    const [userPhoto, setUserPhoto] = useState(null);

    // Cargar la foto del usuario desde localStorage
    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            const photo = localStorage.getItem(`photo_${username}`);
            if (photo) setUserPhoto(photo);
        }
    }, []);

    // Secciones de la navbar (sin Perfil, que será la foto)
    const navbarSections = [
        { title: 'Chat y Soporte', link: '/ChatFAQSupport' },
    ];

    // Secciones principales
    const mainSections = [
        {
            title: 'Mapa Interactivo',
            description: 'Visualiza tus terrenos y sensores en tiempo real.',
            icon: '🗺️',
            link: '/Mapa',
            bgGradient: 'linear-gradient(135deg, #007bff, #17a2b8)',
        },
        {
            title: 'Planes de Parcelas',
            description: 'Adquiere y gestiona planes para tus parcelas agrícolas.',
            icon: '📦',
            link: '/Plans',
            bgGradient: 'linear-gradient(135deg, #ffc107, #fd7e14)',
        },
    ];

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-white bg-white shadow-sm sticky-top py-2">
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/Home">
                        <img src={logo} alt="AgroSense Logo" style={{ height: '35px', marginRight: '10px' }} />
                        <span className="fw-bold text-success fs-5">AgroSense</span>
                    </Link>

                    {/* Botón hamburguesa */}
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

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav align-items-center">
                            {navbarSections.map((sec, idx) => (
                                <li key={idx} className="nav-item mx-1 mx-md-2">
                                    <Link className="nav-link text-success fw-semibold" to={sec.link}>
                                        {sec.title}
                                    </Link>
                                </li>
                            ))}

                            {/* Foto de usuario como link al perfil */}
                            <li className="nav-item ms-3">
                                <Link to="/Perfil">
                                    <img
                                        src={userPhoto || '/default-avatar.png'} // fallback si no hay foto
                                        alt="Usuario"
                                        className="rounded-circle border border-2"
                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="container flex-grow-1 py-3 py-md-5">

                {/* Bienvenida */}
                <div className="text-center mb-4 mb-md-5">
                    <h1 className="fw-bold text-success display-4 display-md-3 mb-3">Bienvenido a AgroSense 🌿</h1>
                    <p className="text-muted fs-5 fs-md-4 lead">
                        Monitorea, analiza y gestiona tus cultivos de forma inteligente con tecnología avanzada.
                    </p>
                </div>

                {/* Cuadros principales: Mapa y Planes */}
                <div className="row g-3 g-md-4 justify-content-center mb-4 mb-md-5">
                    {mainSections.map((sec, idx) => (
                        <div key={idx} className="col-12 col-sm-6 col-md-4">
                            <div className="card shadow-sm border-0 h-100 text-center text-white" style={{ background: sec.bgGradient }}>
                                <div className="card-body d-flex flex-column p-4">
                                    <div className="mb-3" style={{ fontSize: '3rem' }}>{sec.icon}</div>
                                    <h5 className="card-title fw-bold">{sec.title}</h5>
                                    <p className="card-text flex-grow-1">{sec.description}</p>
                                    <Link to={sec.link} className="btn btn-light w-100 mt-auto fw-semibold">Abrir</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dashboard */}
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
