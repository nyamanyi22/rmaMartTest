import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


export const bulkUpdateRma = async (ids, newStatus) => {
  console.log(`[MOCK] Updating status to "${newStatus}" for IDs:`, ids);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: `Mock: Updated ${ids.length} RMAs to status "${newStatus}"` });
    }, 1000);
  });
};


export const fetchRmas = async ({ page = 1, limit = 20, filters = {} }) => {
  const queryParams = new URLSearchParams({
    page: page,
    limit: limit,
    ...filters // Spread filters into query parameters
  }).toString();

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rmas?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Assuming your API returns data in a structure like:
    // {
    //   data: [...rmas],
    //   currentPage: 1,
    //   totalPages: 10,
    //   totalItems: 200,
    //   itemsPerPage: 20
    // }
    return data;
  } catch (error) {
    console.error("Error in fetchRmas service:", error);
    throw error;
  }
};

export const updateRmaStatus = async (rmaId, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rmas/${rmaId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update status for RMA ${rmaId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating status for RMA ${rmaId}:`, error);
    throw error;
  }
};
// In your rmaService.js
export const exportRmas = async (rmaIds = null) => {
  // In a real implementation, this would call your API
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock Excel file creation
      const csvContent = rmaIds 
        ? `RMA ID,Status\n${rmaIds.map(id => `${id},pending`).join('\n')}`
        : 'RMA ID,Status,Customer\n1,pending,John Doe\n2,approved,Jane Smith';
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      resolve(blob);
    }, 1000);
  });
};