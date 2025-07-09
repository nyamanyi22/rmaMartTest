// src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader'; // Assuming AdminHeader handles the top bar
import './styles/AdminLayout.css'; // This CSS file will now contain all layout-related styles

// Function to dynamically get the page title based on the current path
const getPageTitle = (pathname) => {
  if (pathname.startsWith('/admin/rmas/dashboard')) return 'RMA Dashboard';
  if (pathname.startsWith('/admin/rmas/pending')) return 'Pending Approval RMAs';
  if (pathname.startsWith('/admin/rmas/approved')) return 'Approved RMAs';
  if (pathname.startsWith('/admin/rmas/rejected')) return 'Rejected RMAs';
  if (pathname.startsWith('/admin/rmas/processing')) return 'Processing RMAs';
  if (pathname.startsWith('/admin/rmas/bulk')) return 'Bulk RMA Management';
  if (pathname.startsWith('/admin/rmas/manage')) return 'Manage RMA Cases';
  if (pathname.startsWith('/admin/rmas')) return 'RMA Management';

  if (pathname.startsWith('/admin/customers/create')) return 'Create New Customer';
  if (pathname.startsWith('/admin/customers')) return 'Customer Management';

  if (pathname.startsWith('/admin/products/list')) return 'Product Catalog';
  if (pathname.startsWith('/admin/products/serial-numbers')) return 'Serial Numbers';
  if (pathname.startsWith('/admin/products')) return 'Product Management';

  if (pathname.startsWith('/admin/reports/rma-volume')) return 'RMA Volume Report';
  if (pathname.startsWith('/admin/reports/turnaround')) return 'Turnaround Time Report';
  if (pathname.startsWith('/admin/reports/reason-codes')) return 'Return Reasons Report';
  if (pathname.startsWith('/admin/reports')) return 'Reports';

  if (pathname.startsWith('/admin/settings/general')) return 'General Settings';
  if (pathname.startsWith('/admin/settings/shipping')) return 'Shipping Settings';
  if (pathname.startsWith('/admin/settings/return-reasons')) return 'Return Reason Settings';
  if (pathname.startsWith('/admin/settings')) return 'System Settings';

  if (pathname === '/admin' || pathname === '/') return 'Dashboard';

  return 'Admin Panel';
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar open/close
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const currentPageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    console.log("User logging out from Layout component...");
    alert("Logout functionality not fully implemented in this example.");
    // Implement actual logout logic here (e.g., clear tokens, redirect)
  };

  return (
    <div className={`admin-layout-container ${isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      {/* AdminSidebar component - pass isOpen prop for its internal styling */}
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Main content wrapper - This will have dynamic margin-left */}
      <div className="main-content-wrapper">
        {/* AdminHeader component - pass props for its content and sidebar toggle */}
        <AdminHeader
          userName="Current User"
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen} // Pass to header for potential internal adjustments
          toggleSidebar={toggleSidebar} // Pass toggle function to header
          pageTitle={currentPageTitle}
        />

        {/* Main content area where nested routes render */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;