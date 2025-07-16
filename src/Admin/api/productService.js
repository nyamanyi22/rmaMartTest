import adminAxios from './axiosAdmin';

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

export const createProduct = async (formData) => {
  const response = await adminAxios.post('/products', formData);
  return response.data;
};
