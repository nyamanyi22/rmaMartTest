// src/admin/api/rmaService.js
import axiosAdmin from './axiosAdmin';

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

  console.log("Raw response from fetchRmas:", response);
  return response.data;
};

// ✅ Fetch one RMA by ID
export const fetchRmaById = async (id) => {
  const res = await axiosAdmin.get(`/rmas/${id}`);
  return res.data.rma; // Adjust depending on your API response shape
};

// ✅ Update entire RMA (if used for more than just status)
export const updateRma = async (id, data) => {
  const res = await axiosAdmin.put(`/rmas/${id}`, data);
  return res.data;
};

// ✅ Update one RMA status only
export const updateRmaStatus = async (id, newStatus) => {
  const response = await axiosAdmin.patch(`/rmas/${id}/status`, {
    status: newStatus
  });
  return response.data;
};

// ✅ Bulk update statuses
export const bulkUpdateRmaStatus = async (ids = [], newStatus) => {
  const response = await axiosAdmin.post(`/rmas/bulk-update-status`, {
    ids,
    status: newStatus
  });
  return response.data;
};

// ✅ Export RMAs as CSV
export const exportRmas = async (filters = {}) => {
  const response = await axiosAdmin.get('/rmas/export', {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};

// ✅ Delete an RMA
export const deleteRma = async (id) => {
  const response = await axiosAdmin.delete(`/rmas/${id}`);
  return response.data;
};

// ✅ Fetch valid status options
// ✅ Fetch valid status options (with credentials + JSON header)
export const fetchStatusOptions = async () => {
  try {
    const res = await axiosAdmin.get('/rma-statuses', {
      withCredentials: true,
      headers: {
        Accept: 'application/json'
      }
    });
    return res.data.statuses; // Since your backend returns { statuses: [...] }
  } catch (error) {
    console.error('Error loading statuses:', error);
    throw error;
  }
};
