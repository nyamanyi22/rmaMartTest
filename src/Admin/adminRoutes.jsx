// AdminRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from './Components/AdminLayout';
import RmaDashboard from './pages/rmas/RmaDashboard';
import RmaDetailPage from './pages/rmas/RmaDetailPag';
import RejectedRmas from './pages/rmas/RejectedRmas';
import PendingRmas from './pages/rmas/PendingRmas';
import ApprovedRmas from './pages/rmas/ApprovedRmas';
import BulkManagement from './pages/rmas/BulkManagement';
import ProcessingRmas from './pages/rmas/Processing';
import ManageCases from './pages/cases/ManageCases';
import AdminCustomerList from './pages/customers/AdminCustomerList';
import AdminCreateCustomer from './pages/customers/CustomerForm';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';

const AdminRoutes = [
  <Route path="/admin" element={<AdminLayout />} key="admin-root">
    
    <Route path="rmas/dashboard" element={<RmaDashboard />} />
    <Route path="rma/:id" element={<RmaDetailPage />} />
    <Route path="rmas/rejected" element={<RejectedRmas />} />
    <Route path="rmas/pending" element={<PendingRmas />} />
    <Route path="rmas/approved" element={<ApprovedRmas />} />
    <Route path="rmas/bulk" element={<BulkManagement />} />
    <Route path="rmas/processing" element={<ProcessingRmas />} />
    <Route path="rmas/manage" element={<ManageCases />} />

    <Route path="customers/list" element={<AdminCustomerList />} />
    <Route path="customers/create" element={<AdminCreateCustomer />} />

    <Route path="products/ProductList" element={<ProductList />} />
    <Route path="products/create" element={<ProductForm mode="create" />} />
<Route path="products/edit/:id" element={<ProductForm mode="edit" />} />

    <Route path="products/ProductCreate" element={<ProductForm />} />
  </Route>,
];

export default AdminRoutes;
