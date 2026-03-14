import axios from 'axios';

const API = axios.create({
  baseURL: '/api',   // CRA proxy forwards this to localhost:8080
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fw_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fw_token');
      localStorage.removeItem('fw_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;