// src/api.js
import axios from 'axios';

// Instância centralizada
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
});

export default api;