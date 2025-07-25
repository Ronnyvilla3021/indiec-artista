// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000', // ← esta es la clave: estás en local
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
