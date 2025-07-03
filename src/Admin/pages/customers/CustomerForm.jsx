import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateCustomer = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fax: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZipcode: '',
    shippingCountry: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/admin/customers',
        {
          company_name: formData.companyName,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          fax: formData.fax,
          shipping_address1: formData.shippingAddress1,
          shipping_address2: formData.shippingAddress2,
          shipping_city: formData.shippingCity,
          shipping_state: formData.shippingState,
          shipping_zipcode: formData.shippingZipcode,
          shipping_country: formData.shippingCountry,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message || 'Customer created successfully!');
      setFormData({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        fax: '',
        shippingAddress1: '',
        shippingAddress2: '',
        shippingCity: '',
        shippingState: '',
        shippingZipcode: '',
        shippingCountry: '',
      });

    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setSuccess('An error occurred. Check connection or server.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Customer</h2>
      {success && <p className="success-msg">{success}</p>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Company Name</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
          {errors.company_name && <p className="error-msg">{errors.company_name}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            {errors.first_name && <p className="error-msg">{errors.first_name}</p>}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            {errors.last_name && <p className="error-msg">{errors.last_name}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="error-msg">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label>Fax</label>
            <input type="text" name="fax" value={formData.fax} onChange={handleChange} />
            {errors.fax && <p className="error-msg">{errors.fax}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Shipping Address Line 1</label>
          <input type="text" name="shippingAddress1" value={formData.shippingAddress1} onChange={handleChange} />
          {errors.shipping_address1 && <p className="error-msg">{errors.shipping_address1}</p>}
        </div>

        <div className="form-group">
          <label>Shipping Address Line 2</label>
          <input type="text" name="shippingAddress2" value={formData.shippingAddress2} onChange={handleChange} />
          {errors.shipping_address2 && <p className="error-msg">{errors.shipping_address2}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input type="text" name="shippingCity" value={formData.shippingCity} onChange={handleChange} />
            {errors.shipping_city && <p className="error-msg">{errors.shipping_city}</p>}
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" name="shippingState" value={formData.shippingState} onChange={handleChange} />
            {errors.shipping_state && <p className="error-msg">{errors.shipping_state}</p>}
          </div>
        </div>
<input 
  type="text" 
  name="companyName" 
  value={formData.companyName} 
  onChange={handleChange}
  className={errors.company_name ? 'error' : ''}
/>
        <div className="form-row">
          <div className="form-group">
            <label>Zip Code</label>
            <input type="text" name="shippingZipcode" value={formData.shippingZipcode} onChange={handleChange} />
            {errors.shipping_zipcode && <p className="error-msg">{errors.shipping_zipcode}</p>}
          </div>

          <div className="form-group">
            <label>Country</label>
            <input type="text" name="shippingCountry" value={formData.shippingCountry} onChange={handleChange} />
            {errors.shipping_country && <p className="error-msg">{errors.shipping_country}</p>}
          </div>
        </div>

        <button type="submit" className="submit-btn">Create Customer</button>
      </form>
    </div>
  );
};

export default AdminCreateCustomer;
