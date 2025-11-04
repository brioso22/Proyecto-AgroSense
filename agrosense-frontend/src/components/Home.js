import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from './assets/logo.png';
import Dashboard from './Dashboard';

export default function Home() {
    const [userPhoto, setUserPhoto] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // Cargar foto del usuario desde localStorage
    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            const photo = localStorage.getItem(`photo_${username}`);
            if (photo) setUserPhoto(photo);
        }
    }, []);

    const navbarSections = [
        { title: 'Chat y Soporte', link: '/ChatFAQSupport' },
    ];

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

    //  Módulo de clima actual usando Open-Meteo 

    const [clima, setClima] = useState(null);
    const [fechaActual, setFechaActual] = useState('');

    useEffect(() => {
        const hoy = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setFechaActual(hoy.toLocaleDateString('es-ES', opciones));

        // Función para obtener el clima real
        const obtenerClima = async () => {
            try {
                // Coordenadas fijas (Guadalajara, México)
                const lat = 13.6929;
                const lon = -89.2182;

                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                );
                const data = await res.json();
                const c = data.current_weather;
                setClima({
                    temp: c.temperature,
                    viento: c.windspeed,
                    codigo: c.weathercode,
                    hora: c.time,
                });
            } catch (error) {
                console.error("Error al obtener el clima:", error);
            }
        };

        obtenerClima();

        // 🔁 Actualizar cada 15 minutos (900000 ms)
        const intervalo = setInterval(obtenerClima, 900000);
        return () => clearInterval(intervalo);
    }, []);

    // Traducción de códigos de clima de Open-Meteo
    const traducirClima = (codigo) => {
        const codigos = {
            0: "Despejado ☀️",
            1: "Mayormente despejado 🌤️",
            2: "Parcialmente nublado ⛅",
            3: "Nublado ☁️",
            45: "Niebla 🌫️",
            48: "Niebla helada ❄️",
            51: "Llovizna ligera 🌦️",
            61: "Lluvia moderada 🌧️",
            71: "Nevada ligera ❄️",
            80: "Chubascos 🌦️",
            95: "Tormenta ⛈️",
        };
        return codigos[codigo] || "Clima desconocido";
    };

    // -----------------------------------------------------------

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">

            {/* Navbar */}
            <Navbar expanded={expanded} expand="lg" bg="white" variant="light" className="shadow-sm sticky-top py-2">
                <Container>
                    <Navbar.Brand as={Link} to="/Home" className="d-flex align-items-center">
                        <img src={logo} alt="AgroSense Logo" style={{ height: '35px', marginRight: '10px' }} />
                        <span className="fw-bold text-success fs-5">AgroSense</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />

                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav className="align-items-center">
                            {navbarSections.map((sec, idx) => (
                                <Nav.Link
                                    as={Link}
                                    to={sec.link}
                                    key={idx}
                                    className="text-success fw-semibold mx-1 mx-md-2"
                                    onClick={() => setExpanded(false)}
                                >
                                    {sec.title}
                                </Nav.Link>
                            ))}

                            {/* Foto de usuario */}
                            <Nav.Link as={Link} to="/Perfil" className="ms-3 p-0" onClick={() => setExpanded(false)}>
                                <img
                                    src={userPhoto || '/default-avatar.png'}
                                    alt="Usuario"
                                    className="rounded-circle border border-2"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* 🌤️ Clima y fecha actual */}
            <div className="text-center py-4 bg-white shadow-sm border-bottom">
                <h5 className="text-success fw-bold mb-1">{fechaActual}</h5>
                {clima ? (
                    <div>
                        <span className="fs-5">
                            {traducirClima(clima.codigo)} — {clima.temp}°C
                        </span>
                        <p className="text-muted small mb-0">💨 Viento: {clima.viento} km/h</p>
                        <p className="text-muted small mt-1">Actualizado cada 15 min</p>
                    </div>
                ) : (
                    <p className="text-muted small">Cargando clima...</p>
                )}
            </div>

            {/* Contenido principal */}
            <main className="container flex-grow-1 py-3 py-md-5">
                {/* Bienvenida */}
                <div className="text-center mb-4 mb-md-5">
                    <h1 className="fw-bold text-success display-4 display-md-3 mb-3">
                        Bienvenido a AgroSense 🌿
                    </h1>
                    <p className="text-muted fs-5 fs-md-4 lead">
                        Monitorea, analiza y gestiona tus cultivos de forma inteligente con tecnología avanzada.
                    </p>
                </div>

                {/* Cuadros principales */}
                <div className="row g-3 g-md-4 justify-content-center mb-4 mb-md-5">
                    {mainSections.map((sec, idx) => (
                        <div key={idx} className="col-12 col-sm-6 col-md-4">
                            <div
                                className="card shadow-sm border-0 h-100 text-center text-white"
                                style={{ background: sec.bgGradient }}
                            >
                                <div className="card-body d-flex flex-column p-4">
                                    <div className="mb-3" style={{ fontSize: '3rem' }}>{sec.icon}</div>
                                    <h5 className="card-title fw-bold">{sec.title}</h5>
                                    <p className="card-text flex-grow-1">{sec.description}</p>
                                    <Link to={sec.link} className="btn btn-light w-100 mt-auto fw-semibold">
                                        Abrir
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dashboard */}
                <div className="mt-4 mt-md-5">
                    <h4 className="fw-bold text-success mb-3 text-center display-5 display-md-4">
                        Panel de Resumen 📈
                    </h4>
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
