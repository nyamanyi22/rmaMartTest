// src/admin/api/axiosAdmin.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosAdmin = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`, // All admin routes start here
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('adminToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add Authorization Header Automatically (if using token)
axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken'); // Use admin token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdmin;
