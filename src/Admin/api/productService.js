import adminAxios from './axiosAdmin';
import axios from 'axios';

export const fetchProducts = async () => {
  const response = await adminAxios.get('/products');
  return response.data;
};



export const fetchProductById = async (id) => {
  const response = await adminAxios.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await adminAxios.put(`/products/${id}`, formData);
  return response.data;
};
export const deleteProduct = async (id) => {
  const response = await adminAxios.delete(`/products/${id}`);
  return response.data;
};  



// You can store this URL in a .env file and use import.meta.env
const API_URL = 'http://localhost:8000/api/admin/products';

export const createProduct = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      // If you're using Sanctum:
      // 'X-XSRF-TOKEN': token, (optional if cookie-based)
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace this with your actual token logic
    }
  });

  return response.data;
};
