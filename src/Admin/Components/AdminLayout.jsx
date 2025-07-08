// src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const currentPageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    console.log("User logging out from Layout component...");
    alert("Logout functionality not fully implemented in this example.");
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Removed Tailwind classes, now handled by .main-content-wrapper in Layout.css */}
      <div className="main-content-wrapper">
        <AdminHeader
          userName="Current User"
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle={currentPageTitle}
        />

        {/* Removed Tailwind classes, now handled by .main-content in Layout.css */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;