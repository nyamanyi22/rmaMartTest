

// src/admin/api/axiosAdmin.js
import axiosAdmin from "./axiosAdmin";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosAdmin = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`, // All admin routes start here
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('adminToken');

// Add Authorization Header Automatically (if using token)
axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken'); // Use admin token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdmin;

// ✅ Fetch paginated + filtered RMAs
export const fetchRmas = async ({ page = 1, limit = 20, filters = {} }) => {
  const response = await axiosAdmin.get('/rmas', {
    params: {
      page,
      limit,
      search: filters.search || '',
      status: filters.status || '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      returnReason: filters.returnReason || ''
    }
  });
  return response.data; // Should include data.meta.current_page etc.
};

// ✅ Update one RMA status
export const updateRmaStatus = async (id, newStatus) => {
  const response = await axiosAdmin.patch(`/rmas/${id}/status`, {
    status: newStatus
  });
  return response.data;
};
/// ✅ Bulk update statuses
export const bulkUpdateRmaStatus = async (ids = [], newStatus) => {
  const response = await axiosAdmin.post(`/rmas/bulk-update-status`, {
    ids,
    status: newStatus
  });
  return response.data;
};

// ✅ Export RMA as CSV (filtered or all)
export const exportRmas = async (filters = {}) => {
  const response = await axiosAdmin.get('/rmas/export', {
    params: filters,
    responseType: 'blob' // Required for CSV download
  });
  return response;
};
