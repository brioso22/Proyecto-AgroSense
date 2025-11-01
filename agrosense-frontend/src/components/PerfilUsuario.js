import { useEffect, useState } from 'react';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserCircle, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    zone: '',
  });

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await api.get('users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData(res.data);

        // Cargar foto asociada al usuario
        const savedPhoto = localStorage.getItem(`photo_${res.data.username}`);
        if (savedPhoto) setPhoto(savedPhoto);
      } catch (err) {
        setError('Error al cargar el perfil');
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put('users/me/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        localStorage.setItem(`photo_${user.username}`, reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!user) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-light">
        <div className="text-center mb-4">
          {/* Foto siempre visible */}
          {photo ? (
            <img
              src={photo}
              alt="Perfil"
              className="rounded-circle shadow-sm"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
          ) : (
            <FaUserCircle size={120} className="text-success mb-2" />
          )}

          {/* Input solo si está en edición */}
          {isEditing && (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm"
                onChange={handlePhotoChange}
              />
            </div>
          )}

          <h2 className="fw-bold text-success mt-2">Perfil de Usuario</h2>
          <p className="text-muted">Gestiona tu información personal y configuración</p>
        </div>

        {isEditing ? (
          <div className="row g-3">
            {['username', 'first_name', 'last_name', 'email', 'zone'].map((field, idx) => (
              <div className="col-12 col-md-6" key={idx}>
                <label className="form-label text-capitalize">{field.replace('_', ' ')}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  className="form-control"
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={field === 'username'}
                />
              </div>
            ))}

            <div className="col-12 d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleSave}>
                <FaSave /> Guardar
              </button>
              <button className="btn btn-secondary d-flex align-items-center gap-2" onClick={() => setIsEditing(false)}>
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {[
              { label: 'Usuario', value: user.username },
              { label: 'Nombre', value: user.first_name },
              { label: 'Apellido', value: user.last_name },
              { label: 'Correo electrónico', value: user.email },
              { label: 'Zona', value: user.zone },
            ].map((item, idx) => (
              <div className="col-12 col-md-6" key={idx}>
                <div className="bg-white shadow-sm rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
                  <p className="mb-1 fw-semibold text-muted">{item.label}</p>
                  <p className="mb-0 fs-5">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="col-12 text-center mt-4">
              <button className="btn btn-primary d-flex align-items-center gap-2 mx-auto" onClick={() => setIsEditing(true)}>
                <FaEdit /> Editar perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

