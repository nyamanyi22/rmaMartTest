// src/admin/api/axiosAdmin.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosAdmin = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`, // All admin routes start here
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },  
});

axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken'); // Use admin token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ Fix: one space
  }
  return config;
});

export default axiosAdmin;
