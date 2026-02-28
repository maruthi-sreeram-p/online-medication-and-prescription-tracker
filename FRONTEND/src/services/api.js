import axios from 'axios';

/**
 * API SERVICE
 * Purpose: Axios instance for all backend API calls
 * Base URL: http://localhost:8321/api
 */
const api = axios.create({
  baseURL: 'http://localhost:8321/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;