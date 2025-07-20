// src/admin/services/adminCustomerService.js
import adminAxios from './axiosAdmin'; // Your Axios instance with auth interceptor

const API_URL = '/customers'; // Base path for customer API endpoints

/**
 * Fetches a list of customers from the API.
 * Supports pagination, search, and sorting.
 *
 * @param {object} params
 * @param {number} params.page - Current page number.
 * @param {number} params.perPage - Items per page.
 * @param {string} params.search - Search query.
 * @returns {Promise<{data: Array, total: number, page: number}>}
 */
export const fetchCustomers = async (params = {}) => {
  try {
    // This assumes your Laravel backend handles pagination and search.
    // If your backend fetches all and you filter client-side, adjust this.
    const response = await adminAxios.get(API_URL, {
      params: {
        page: params.page,
        per_page: params.perPage, // Laravel typically expects 'per_page'
        search: params.search,
        // Add other filter parameters here if your API supports them
      },
    });

    // Adjust based on your actual Laravel API response structure
    // Example: { data: [...customers], meta: { total: 100, current_page: 1 } }
    return {
      data: response.data.data || response.data, // Fallback for direct array response
      total: response.data.meta?.total || response.data.length, // Fallback for total if no meta
      page: response.data.meta?.current_page || params.page,
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Fetches a single customer by ID.
 * @param {string} id - The ID of the customer to fetch.
 * @returns {Promise<object>}
 */
export const fetchCustomerById = async (id) => {
  try {
    const response = await adminAxios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new customer.
 * @param {object} customerData - Data for the new customer.
 * @returns {Promise<object>}
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await adminAxios.post(API_URL, customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

/**
 * Updates an existing customer by ID.
 * @param {string} id - The ID of the customer to update.
 * @param {object} customerData - The updated data for the customer.
 * @returns {Promise<object>}
 */
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await adminAxios.put(`${API_URL}/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a customer by ID.
 * @param {string} id - The ID of the customer to delete.
 * @returns {Promise<any>}
 */
export const deleteCustomer = async (id) => {
  try {
    const response = await adminAxios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
};
