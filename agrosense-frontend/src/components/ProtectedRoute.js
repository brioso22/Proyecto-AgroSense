import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // 🔐 Obtener token de acceso del almacenamiento local
  const token = localStorage.getItem("access_token");

  // ⚠️ Validar que exista y no esté vacío o en "undefined"
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  // 🚫 Si no hay token válido, redirigir al inicio
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si está autenticado, mostrar el contenido protegido
  return children;
}
