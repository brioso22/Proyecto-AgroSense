import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const username = localStorage.getItem('username'); // Aquí defines si hay sesión

    if (!username) {
        // No hay usuario logeado, redirigir al login
        return <Navigate to="/" replace />;
    }

    // Si hay sesión, renderiza el componente hijo (ej. Home)
    return children;
}
