import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/logo.png'; // avatar o logo por defecto

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token'); // o tu método de auth
    axios.get('/api/users/me/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.data);
        setFormData({
          first_name: res.data.data.first_name || '',
          last_name: res.data.data.last_name || '',
          email: res.data.data.email || ''
        });
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.put('/api/users/me/', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.data);
        setStatusMessage('Perfil actualizado correctamente ✅');
        setEditMode(false);
      })
      .catch(err => {
        console.error(err);
        setStatusMessage('Error al actualizar el perfil ❌');
      });
  };

  if (!user) {
    return <div className="text-center mt-5">Cargando perfil...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex align-items-center bg-success text-white">
          <img src={logo} alt="Avatar" className="rounded-circle me-3" width="50" height="50" />
          <h5 className="mb-0">Perfil de {user.first_name} {user.last_name}</h5>
        </div>
        <div className="card-body">
          {statusMessage && <div className="alert alert-info">{statusMessage}</div>}
          
          {editMode ? (
            <>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <button className="btn btn-success me-2" onClick={handleSave}>Guardar</button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {user.first_name}</p>
              <p><strong>Apellido:</strong> {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>Editar Perfil</button>
            </>
          )}
        </div>
        <div className="card-footer text-muted d-flex justify-content-between">
          <small>ID: {user.id}</small>
          <small>Última actualización: {new Date(user.last_login).toLocaleString()}</small>
        </div>
      </div>
    </div>
  );
}
