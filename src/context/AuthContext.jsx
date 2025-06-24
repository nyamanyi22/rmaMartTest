import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set axios default headers when token exists
  const setAxiosAuthHeader = useCallback((token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, []);

  // Clear axios auth header
  const clearAxiosAuthHeader = useCallback(() => {
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  // Verify token validity with backend
  const verifyToken = useCallback(async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const userData = await verifyToken(token);
          login(userData, token, false);
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [verifyToken]);

  // Login function
  const login = async (credentials, redirectPath = '/') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('http://127.0.0.1:8000/api/login', credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('authToken', token);
      setAxiosAuthHeader(token);
      setUser(user);
      setIsAuthenticated(true);
      navigate(redirectPath);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      clearAxiosAuthHeader();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('http://127.0.0.1:8000/api/register', userData);
      const { user, token } = response.data;
      
      localStorage.setItem('authToken', token);
      setAxiosAuthHeader(token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.errors || { message: 'Registration failed' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      register,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};