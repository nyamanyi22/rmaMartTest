import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAdmin from '../api/axiosAdmin';
import { useAdminAuth } from '../AdminContex/AdminAuthContext';
import './styles/AdminLogin.css';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axiosAdmin.post('/login', {
        email: form.email,
        password: form.password
      });

      const { token } = res.data;
      // Save token & set default header
      localStorage.setItem('adminToken', token);
      axiosAdmin.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await login(form.email, form.password); // update context state
      navigate('/admin/rmas/dashboard');
    } catch (err) {
      console.error('Login error', err);
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <div className="error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
