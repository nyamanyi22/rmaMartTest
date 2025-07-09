import adminAxios from 'axiosAdmin'; 

export const fetchProducts = async () => {
  const response = await adminAxios.get('/api/admin/products');
  return response.data;
};
