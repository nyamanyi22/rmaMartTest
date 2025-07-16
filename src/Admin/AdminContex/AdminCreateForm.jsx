import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'csr', // default value
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post('http://localhost:8000/api/admins', formData); // Adjust to your route
      setMessage({ type: 'success', text: 'Admin created successfully' });
      setFormData({
        name: '',
        email: '',
        role: 'csr',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error creating admin',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>

      {message && (
        <div className={`p-2 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Role</label>
        <select name="role" value={formData.role} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
          <option value="superadmin">Super Admin</option>
          <option value="csr">CSR</option>
          <option value="viewonly">View Only</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Confirm Password</label>
        <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      </div>

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {loading ? 'Creating...' : 'Create Admin'}
      </button>
    </form>
  );
};

export default AdminCreateForm;
