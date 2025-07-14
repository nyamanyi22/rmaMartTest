import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Create the context
const AdminAuthContext = createContext();

// 2. Provider component
export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [loading, setLoading] = useState(true);

  // 3. Fetch current admin (if token exists)
  useEffect(() => {
    const fetchAdmin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdmin(res.data); // res.data should be the admin object
      } catch (error) {
        console.error('❌ Admin auth fetch failed:', error);
        localStorage.removeItem('adminToken');
        setToken('');
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [token]);
//login
const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:8000/api/admin/login', {
      email,
      password,
    });

    const receivedToken = res.data.token;
    const adminInfo = res.data.admin;

    // ⬇️ SET AXIOS DEFAULT HEADER HERE 🔥
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

    // Save token + set state
    localStorage.setItem('adminToken', receivedToken);
    setToken(receivedToken);
    setAdmin(adminInfo);
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

  // 5. Logout method
  const logout = async () => {
    if (token) {
      try {
        await axios.post(
          'http://localhost:8000/api/admin/logout',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error('⚠️ Logout failed:', error);
      }
    }

    localStorage.removeItem('adminToken');
    setToken('');
    setAdmin(null);
  };

  // 6. Context value
  const value = {
    admin,
    token,
    login,
    logout,
    isAuthenticated: !!admin,
    loading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// 7. Hook for easy access
export const useAdminAuth = () => useContext(AdminAuthContext);
