import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosAdmin from '../api/axiosAdmin'; // 🔥 Use your custom axios instance

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [loading, setLoading] = useState(true);

  // Fetch admin on token load (after page refresh)
  useEffect(() => {
    const fetchAdmin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosAdmin.get('/me'); // ✅ use axiosAdmin
        setAdmin(res.data.admin ?? res.data); // support both formats
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

  // 🔐 Login method
  const login = async (email, password) => {
    try {
      const res = await axiosAdmin.post('/login', { email, password });

      const receivedToken = res.data.token;
      const adminInfo = res.data.admin;

      // Save token
      localStorage.setItem('adminToken', receivedToken);
      setToken(receivedToken);
      setAdmin(adminInfo);
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  // 🚪 Logout method
  const logout = async () => {
    try {
      await axiosAdmin.post('/logout'); // ✅ no need for manual headers
    } catch (error) {
      console.warn('⚠️ Logout failed:', error);
    }

    localStorage.removeItem('adminToken');
    setToken('');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        login,
        logout,
        isAuthenticated: !!admin,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
