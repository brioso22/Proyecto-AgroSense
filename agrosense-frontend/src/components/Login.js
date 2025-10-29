import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Registro
        await api.post('users/', { username, password });
        setError('Usuario creado correctamente. Ahora haz login.');
        setIsRegister(false);
        setUsername('');
        setPassword('');
      } else {
        // Login
        const res = await api.post('token/', { username, password });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos / Error en registro');
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Registro' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">{isRegister ? 'Registrarse' : 'Login'}</button>
      </form>

      <p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? '¿Ya tienes cuenta? Login' : '¿No tienes cuenta? Registrarse'}
      </p>

      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}
