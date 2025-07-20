// src/admin/pages/EditCustomer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminCustomerForm from './AdminCustomerForm';
i
import MessageModal from '../../Components/MessageModal';

const EditCustomer = () => {
  const { id } = useParams(); // get customer ID from URL
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    type: 'success',
    message: '',
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await adminAxios.get(`/customers/${id}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error('Error fetching customer:', error);
        setModal({
          show: true,
          type: 'error',
          message: 'Failed to load customer data.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await adminAxios.put(`/customers/${id}`, formData);
      console.log('Customer updated:', response.data);
      setModal({
        show: true,
        type: 'success',
        message: 'Customer updated successfully!',
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      setModal({
        show: true,
        type: 'error',
        message: error?.response?.data?.message || 'Failed to update customer.',
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>

      <AdminCustomerForm
        isEditing={true}
        initialData={customerData}
        onSubmit={handleFormSubmit}
      />

      <MessageModal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
};

export default EditCustomer;
