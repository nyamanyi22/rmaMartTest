import React from 'react';
import ProductForm from './ProductForm';
import { createProduct } from '../../api/productService'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const CreateProductPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await createProduct(formData);
      alert('Product created successfully!');
      navigate('/admin/products'); // Adjust path to your product list page
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please check input and try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProductPage;
