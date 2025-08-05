

// src/admin/api/axiosAdmin.js
import axiosAdmin from "./axiosAdmin";


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

  console.log("Raw response from fetchRmas:", response); // ✅ Moved above return

  return response.data;
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
