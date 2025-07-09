import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Index';
import Contact from './Pages/ContactUs';
import ReturnPolicy from './Pages/ReturnPolicy';
import CustomerSignup from './Pages/SignUp';
import Login from './components/Login';
import PreRequest from './Pages/PreRMARequest';
import RMARequest from './Pages/RMARequest';
import PrivateRoute from './components/PrivateRoute';

// Admin Routes
import AdminRoutes from './Admin/adminRoutes';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/returnPolicy" element={<ReturnPolicy />} />
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/PreRequest" element={<PrivateRoute><PreRequest /></PrivateRoute>} />
        <Route path="/RMARequest" element={<PrivateRoute><RMARequest /></PrivateRoute>} />
        
        {/* Spread the admin route array */}
        {AdminRoutes}
      </Routes>
    </AuthProvider>
  );
}

export default App;
