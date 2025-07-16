// src/Admin/components/RequireAdminAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminContex/AdminAuthContext'; // ✅ use context hook

const RequireAdminAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default RequireAdminAuth;
