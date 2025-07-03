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
      // If token is invalid, clear it from storage
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
      }
      throw error;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');
      
      if (token) {
        try {
          // First try to verify the token with backend
          const userData = await verifyToken(token);
          setAxiosAuthHeader(token);
          setUser(userData);
          setIsAuthenticated(true);
          // Update stored user data if needed
          localStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
          console.error('Token verification failed:', error);
          // Fallback to stored user data if verification fails but token exists
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [verifyToken, setAxiosAuthHeader]);

  // Login function (supports both credentials-based and direct login)
  const login = async (credentialsOrUser, redirectPath = '/', directToken = null) => {
    try {
      setIsLoading(true);
      setError(null);

      let user, token;

      if (directToken) {
        // Direct login with existing token
        user = credentialsOrUser;
        token = directToken;
      } else {
        // Normal credentials login
        const response = await axios.post('http://127.0.0.1:8000/api/login', credentialsOrUser);
        user = response.data.customer;
        token = response.data.token;
      }

      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      // Set auth state
      setAxiosAuthHeader(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect
      navigate(redirectPath || '/');

      return { user, token };

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Only attempt server logout if we have a token
      if (localStorage.getItem('authToken')) {
        await axios.post('http://127.0.0.1:8000/api/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side auth state regardless of server success
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
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
      const { customer: user, token } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      // Set auth state
      setAxiosAuthHeader(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect
      navigate('/');

      return { user, token };

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.errors || 
                         'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  //fetch user
const fetchUser = async () => {
  try {
    const res = await axios.get('/api/profile');
    setUser(res.data.user);
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 419) {
      setUser(null);
    }
  } 
};

  // Update user data
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
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
      updateUser,
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