import React from 'react'
import Sidebar from './AdminSideba'
import  Header from './AdminHeader'
import { Outlet } from 'react-router-dom';

 const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-auto">
        <Header />
        <main className="p-4 overflow-y-auto">{children}</main>
          <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;