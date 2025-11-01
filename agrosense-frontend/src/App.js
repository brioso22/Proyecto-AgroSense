import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import PerfilUsuario from './components/PerfilUsuario';
import Mapa from './components/Mapa';
import Logout from './components/Logout';
import Plans from './components/Plans';
import ChatFAQSupport from './components/ChatFAQSupport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/Dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Home" 
          element={
            <ProtectedRoute>
              <Home />
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

        {/* Nueva ruta de chat de soporte */}

        <Route 
          path="/ChatFAQSupport" 
          element={
            <ProtectedRoute>
              <ChatFAQSupport />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
