// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is not logged in, redirect to signup
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, show the protected component
  return children;
};

export default PrivateRoute;
