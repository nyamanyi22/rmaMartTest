import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from './Components/AdminLayout';
import RmaDashboard from './pages/rmas/RmaDashboard';
import RmaDetailPage from './pages/rmas/RmaDetailPag';
import RejectedRmas from './pages/rmas/RejectedRmas';
import PendingRmas from './pages/rmas/PendingRmas';
import ApprovedRmas from './pages/rmas/ApprovedRmas';
import BulkManagement from './pages/rmas/BulkMAnagement';
import ProcessingRmas from './pages/rmas/Processing';
import ManageCases from './pages/cases/ManageCases';
import CustomerList from './pages/customers/CustomerList'; // New List Component
import CreateCustomer from './pages/customers/CreateCustomer'; // New Create Component
import UpdateCustomer from './pages/customers/EditCustomer'; // New Edit Component
import ProductList from './pages/products/ProductList';
import CreateProductPage from './pages/products/CreateProductPage';
import EditProductPage from './pages/products/EditProductPage';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminLogin from './Components/AdminLogin';
import RequireAdminAuth from './Components/RequireAdminAuth';
import AdminCreateForm from './AdminContex/AdminCreateForm';
import AdminList from './AdminContex/UserList';

const AdminRoutes = [
  <Route path="/admin/login" element={<AdminLogin />} key="admin-login" />,

  <Route
    path="/admin"
    element={
      <RequireAdminAuth>
        <AdminLayout />
      </RequireAdminAuth>
    }
    key="admin-root"
  >
    <Route path="rmas/dashboard" element={<RmaDashboard />} />
    <Route path="rma/:id" element={<RmaDetailPage />} />
    <Route path="rmas/rejected" element={<RejectedRmas />} />
    <Route path="rmas/pending" element={<PendingRmas />} />
    <Route path="rmas/approved" element={<ApprovedRmas />} />
    <Route path="rmas/bulk" element={<BulkManagement />} />
    <Route path="rmas/processing" element={<ProcessingRmas />} />
    <Route path="rmas/manage" element={<ManageCases />} />
    <Route path="customers/list" element={<CustomerList />} />
    <Route path="customers/create" element={<CreateCustomer />} />
      <Route path="customers/edit/:id" element={<UpdateCustomer />} />
    <Route path="products" element={<ProductList />} />
    <Route path="products/create" element={<CreateProductPage />} />
    <Route path="products/edit/:id" element={<EditProductPage />} />
    <Route path="profile" element={<AdminProfile />} />
    <Route path="admin/create" element={<AdminCreateForm />} />
    <Route path="users/list" element={<AdminList />} />
    
    
  </Route>,
];

export default AdminRoutes;
