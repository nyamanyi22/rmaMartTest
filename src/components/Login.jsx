import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Login.css';
import axiosClient from '../axioClient';
import Header from './header';
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user was trying to visit before being redirected to login
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Request CSRF token for Sanctum
      await axiosClient.get('/sanctum/csrf-cookie');

      // Send login request
      const response = await axiosClient.post('/api/login', formData);

      // Save user and token using context
      login(response.data.customer, response.data.token);

      // Redirect to original page
      navigate(from);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <form onSubmit={handleSubmit} className="login-card">
        <Header />
        <h2 className="login-title">Login</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="login-input"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="login-input"
            required
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="signup-prompt">
          Don't have an account?{' '}
          <Link to="/signup" className="signup-link">
            Sign Up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
