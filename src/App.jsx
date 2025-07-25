import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './Admin/AdminContex/AdminAuthContext';

// Customer Pages
import HomePage from './Pages/Index';
import Contact from './Pages/ContactUs';
import ReturnPolicy from './Pages/ReturnPolicy';
import CustomerSignup from './Pages/SignUp';
import Login from './components/Login';
import PreRequest from './Pages/PreRMARequest';
import RMARequest from './Pages/RMARequest';
import PrivateRoute from './components/PrivateRoute';

// Admin Routes (already defined as <Route> elements)
import AdminRoutes from './Admin/adminRoutes';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Routes>
          {/* customer routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/returnPolicy" element={<ReturnPolicy />} />
          <Route path="/signup" element={<CustomerSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/PreRequest" element={<PrivateRoute><PreRequest /></PrivateRoute>} />
          <Route path="/RMARequest" element={<PrivateRoute><RMARequest /></PrivateRoute>} />

          {/* admin routes */}
          {AdminRoutes}
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
  );
}


export default App;
