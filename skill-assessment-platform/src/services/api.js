// src/services/api.js
// Base configuration for axios
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;