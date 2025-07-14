import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', {
        email,
        password,
      });

      // Save token or session as needed (e.g., localStorage)
      localStorage.setItem('adminToken', response.data.token);
      alert('✅ Login successful!');
      // Redirect or update UI
    } catch (err) {
      setError('❌ Invalid credentials or server error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow-xl border rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
