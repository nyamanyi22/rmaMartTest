import React, { useState } from 'react';
import axios from 'axios';
import './styles/AdminCreateForm.css';
import { useNavigate } from 'react-router-dom'; 

const AdminCreateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'csr',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrors({});

    try {
      const res = await axios.post('http://localhost:8000/api/admin/admins', formData);
      setMessage({ type: 'success', text: res.data.message });
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        role: 'csr',
        password: '',
        password_confirmation: '',
      });
      navigate('/admin/users/list', { state: { message: 'Admin created successfully!' } });
    } catch (error) {
      if (error.response?.status === 422) {
        // validation errors
        setErrors(error.response.data.errors);
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Error creating admin',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>Create New Admin</h2>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <label>First Name</label>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      {errors.first_name && <small className="error">{errors.first_name[0]}</small>}

      <label>Last Name</label>
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
      {errors.last_name && <small className="error">{errors.last_name[0]}</small>}

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {errors.email && <small className="error">{errors.email[0]}</small>}

      <label>Role</label>
      <select name="role" value={formData.role} onChange={handleChange} required>
        <option value="super_admin">Super Admin</option>
        <option value="csr">CSR</option>
        <option value="viewonly">View Only</option>
      </select>
      {errors.role && <small className="error">{errors.role[0]}</small>}

      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
      {errors.password && <small className="error">{errors.password[0]}</small>}

      <label>Confirm Password</label>
      <input
        type="password"
        name="password_confirmation"
        value={formData.password_confirmation}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Admin'}
      </button>
    </form>
  );
};

export default AdminCreateForm;
