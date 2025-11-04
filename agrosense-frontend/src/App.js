import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🧩 Componentes
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import PerfilUsuario from "./components/PerfilUsuario";
import Mapa from "./components/Mapa";
import Logout from "./components/Logout";
import Plans from "./components/Plans";
import ChatFAQSupport from "./components/ChatFAQSupport";

// 🔐 Ruta protegida
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* 🔒 Rutas protegidas */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Perfil"
          element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Mapa"
          element={
            <ProtectedRoute>
              <Mapa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Plans"
          element={
            <ProtectedRoute>
              <Plans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ChatFAQSupport"
          element={
            <ProtectedRoute>
              <ChatFAQSupport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
