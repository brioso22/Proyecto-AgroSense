import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // 👈 Importa los íconos de Bootstrap

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const getPasswordErrors = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push('Al menos 8 caracteres');
    if (!/[a-z]/.test(pwd)) errors.push('Una letra minúscula');
    if (!/[A-Z]/.test(pwd)) errors.push('Una letra mayúscula');
    if (!/\d/.test(pwd)) errors.push('Un número');
    if (!/[^A-Za-z0-9]/.test(pwd)) errors.push('Un símbolo especial');
    return errors;
  };

  const passwordErrors = isRegister ? getPasswordErrors(password) : [];
  const validatePassword = (pwd) => passwordErrors.length === 0;

  const isFormValid = isRegister
    ? username &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      validatePassword(password) &&
      firstName &&
      lastName &&
      email &&
      zone &&
      acceptedTerms
    : username && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError('❌ Las contraseñas no coinciden.');
          return;
        }
        if (!validatePassword(password)) {
          setError('❌ La contraseña no cumple con los requisitos.');
          return;
        }
        if (!acceptedTerms) {
          setError('❌ Debes aceptar los términos y condiciones.');
          return;
        }
        await api.post('users/', {
          username,
          password,
          first_name: firstName,
          last_name: lastName,
          email,
          zone,
        });
        setError('✅ Usuario creado correctamente. Ahora inicia sesión.');
        setIsRegister(false);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setZone('');
        setAcceptedTerms(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
      } else {
        // Login
        const res = await api.post('token/', { username, password });
        const token = res.data.access;

        // Guardar token y username en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username); // 👈 clave importante para Home

        console.log('Token guardado ✅');
        navigate('/home');
      }
    } catch (err) {
      if (err.response && err.response.data.username) {
        setError(`❌ ${err.response.data.username[0]}`);
      } else {
        setError('❌ Usuario o contraseña incorrectos / Error en registro');
      }
    }
  };

  const isSuccess = error.startsWith('✅');

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' }}
    >
      <div className="card shadow-lg border-0 p-4 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-3">
          <img src="/logo.png" alt="AgroSense" style={{ width: '90px', height: '90px' }} />
          <h3 className="mt-2" style={{ color: '#2E7D32', fontWeight: '700' }}>
            Agro<span style={{ color: '#4CAF50' }}>Sense</span>
          </h3>
          <h5 className="text-muted mt-2">
            {isRegister ? 'Crea tu cuenta' : 'Inicio de sesión'}
          </h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ backgroundColor: '#f1f8e9' }}
            />
          </div>

          {isRegister && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={{ backgroundColor: '#f1f8e9' }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  style={{ backgroundColor: '#f1f8e9' }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control rounded-pill"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ backgroundColor: '#f1f8e9' }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Zona"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  required
                  style={{ backgroundColor: '#f1f8e9' }}
                />
              </div>
            </>
          )}

          {/* Contraseña */}
          <div className="mb-3">
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control rounded-start-pill"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: '#f1f8e9' }}
              />
              <button
                type="button"
                className="btn btn-light border-0 rounded-end-pill"
                onClick={() => setShowPassword(!showPassword)}
                style={{ backgroundColor: '#f1f8e9' }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>

            {isRegister && password && passwordErrors.length > 0 && (
              <div className="mt-2">
                <small className="text-danger">
                  La contraseña debe incluir:
                  <ul className="mb-0">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </small>
              </div>
            )}
          </div>

          {isRegister && (
            <>
              <div className="mb-3">
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control rounded-start-pill"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ backgroundColor: '#f1f8e9' }}
                  />
                  <button
                    type="button"
                    className="btn btn-light border-0 rounded-end-pill"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ backgroundColor: '#f1f8e9' }}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="termsCheck"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                />
                <label className="form-check-label" htmlFor="termsCheck">
                  Acepto los términos y condiciones
                </label>
              </div>
            </>
          )}

          <div className="d-grid">
            <button
              type="submit"
              className="btn rounded-pill"
              disabled={!isFormValid}
              style={{
                backgroundColor: isFormValid ? '#2E7D32' : '#cccccc',
                color: '#fff',
                fontWeight: '600',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
              }}
            >
              {isRegister ? 'Registrarse' : 'Iniciar sesión'}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <p
            className="m-0"
            style={{ color: '#2E7D32', cursor: 'pointer', fontWeight: '500' }}
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setConfirmPassword('');
              setAcceptedTerms(false);
              setShowPassword(false);
              setShowConfirmPassword(false);
            }}
          >
            {isRegister
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </p>
        </div>

        {error && (
          <div
            className={`alert mt-3 py-2 text-center ${
              isSuccess ? 'alert-success' : 'alert-warning'
            }`}
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
