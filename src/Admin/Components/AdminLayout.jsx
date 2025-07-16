// src/components/AdminLayout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './styles/AdminLayout.css';
import { useAdminAuth } from '../AdminContex/AdminAuthContext';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout, loading } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
    if (saved !== null) {
      setIsSidebarOpen(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    localStorage.setItem('adminSidebarOpen', newState);
    setIsSidebarOpen(newState);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const currentPageTitle = getPageTitle(location.pathname);

  if (loading) {
    return <div className="admin-loading-screen">Loading admin panel...</div>;
  }

  if (!admin) {
    return null; // or a redirect to login
  }

  return (
    <div className={`admin-layout-container ${isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="main-content-wrapper">
        <AdminHeader />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
