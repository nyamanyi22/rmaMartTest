const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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