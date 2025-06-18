import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      
      login({ email: formData.email });
      navigate('/');
    }
  };

  return (
    <div className="login-page-container"> {/* <-- NEW CLASS */}
      <form onSubmit={handleSubmit} className="login-card"> {/* <-- NEW CLASS */}
        <h2 className="login-title">Login</h2> {/* <-- NEW CLASS */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="login-input" /* <-- NEW CLASS */
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="login-input" /* <-- NEW CLASS */
          required
        />
        <button type="submit" className="login-button">Log In</button> {/* <-- NEW CLASS */}
      </form>
    </div>
  );
};

export default Login;