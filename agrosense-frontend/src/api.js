import axios from 'axios';

// Reemplaza 192.168.1.100 por la IP de tu PC en la red
const api = axios.create({
  baseURL: 'http://192.168.0.12:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;