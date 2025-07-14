import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminContex/AdminAuthContext'; // ✅ context hook

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAdminAuth(); // ✅ use context login method

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password); // ✅ use context
      alert('✅ Login successful!');
      navigate('/admin/rmas/dashboard'); // ✅ use absolute path
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      setError('❌ Invalid credentials or server error');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
