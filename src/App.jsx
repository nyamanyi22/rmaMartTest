import React from 'react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './Pages/Index';
import Contact from './Pages/ContactUs';
import ReturnPolicy from './Pages/ReturnPolicy';
import CustomerSignup from './Pages/SignUp';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import PreRequest from './Pages/PreRMARequest';
import RMARequest from './Pages/RMARequest';
import PrivateRoute from './components/PrivateRoute'; // Import your PrivateRoute component
function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/contact" element={<Contact />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/returnPolicy" element={<ReturnPolicy />} />
      <Route path="/signup" element={<CustomerSignup/>} />
      <Route path="/login" element={<Login />} />
      {/* Private route for RMARequest */}
<Route path="/PreRequest" element={<PreRequest />} />
<Route path="/RMARequest" element={<PrivateRoute><RMARequest /></PrivateRoute>} />
     
    </Routes>
    </AuthProvider>
  );
}

export default App;