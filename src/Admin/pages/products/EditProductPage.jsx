import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { fetchProductById, updateProduct } from '../../api/productService'; // Adjust the import path as necessary

const EditProductPage = () => {
  const { id } = useParams(); // get product ID from URL
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(id);
        setInitialData(product);
      } catch (error) {
        console.error('Failed to load product:', error);
        alert('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateProduct(id, formData);
      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!initialData) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <ProductForm
        initialData={initialData}
        onSubmit={handleUpdate}
        isEditing={true}
      />
    </div>
  );
};

export default EditProductPage;
