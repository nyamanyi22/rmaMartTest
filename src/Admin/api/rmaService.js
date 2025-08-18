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
  return res.data.rma;
};

// ✅ Update entire RMA (full update)
export const updateRma = async (id, data) => {
  const res = await axiosAdmin.put(`/rmas/${id}`, data);
  return res.data;
};

// ✅ Update one RMA status only
export const updateRmaStatus = async (id, newStatus) => {
  const statusEnumMap = {
    pending: 'PENDING',
    approved: 'APPROVED',
    rejected: 'REJECTED',
    completed: 'COMPLETED',
    processing: 'PROCESSING'
  };

  const status = statusEnumMap[newStatus.toLowerCase()];
  if (!status) throw new Error(`Invalid status: ${newStatus}`);

  const response = await axiosAdmin.patch(`/rmas/${id}/status`, {
    status
  });
  return response.data;
};

// ✅ Bulk update RMA statuses
export const bulkUpdateRmaStatus = async (ids = [], newStatus) => {
  if (!ids.length) throw new Error('No RMA IDs selected');

  const statusEnumMap = {
    pending: 'PENDING',
    approved: 'APPROVED',
    rejected: 'REJECTED',
    completed: 'COMPLETED',
    processing: 'PROCESSING'
  };

  const status = statusEnumMap[newStatus.toLowerCase()];
  if (!status) throw new Error(`Invalid status: ${newStatus}`);

  const response = await axiosAdmin.put('/rmas/bulk-status-update', {
    ids: ids.map(id => Number(id)),
    status
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

// ✅ Delete an RMA (unchanged)
export const deleteRma = async (id) => {
  const response = await axiosAdmin.delete(`/rmas/${id}`);
  return response.data;
};

// ✅ Fetch valid status options
export const fetchStatusOptions = async () => {
  try {
    const res = await axiosAdmin.get('/rma-statuses', {
      withCredentials: true,
      headers: {
        Accept: 'application/json'
      }
    });
    return res.data.statuses;
  } catch (error) {
    console.error('Error loading statuses:', error);
    throw error;
  }
};
