import { Outlet, Route } from 'react-router-dom';
import AdminLayout from './Components/AdminLayout';
import RmaDashboard from './pages/rmas/RmaDashboard';
import RmaDetailPage from './pages/rmas/RmaDetailPage';
import RejectedRmas from './pages/rmas/RejectedRmas';
import PendingRmas from './pages/rmas/PendingRmas';
import ApprovedRmas from './pages/rmas/ApprovedRmas';
import BulkManagement from './pages/rmas/BulkManagement';
import ProcessingRmas from './pages/rmas/ProcessingRmas';
import ManageCases from './pages/cases/ManageCases';
import AdminCustomerList from './pages/customers/AdminCustomerList';
import AdminCreateCustomer from './pages/customers/AdminCreateCustomer';

export default function AdminRoutes() {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      {/* RMA Management */}
      <Route path="dashboard" element={<RmaDashboard />} />
      <Route path="rma/:id" element={<RmaDetailPage />} />
      <Route path="rmas/rejected" element={<RejectedRmas />} />
      <Route path="rmas/pending" element={<PendingRmas />} />
      <Route path="rmas/approved" element={<ApprovedRmas />} />
      <Route path="rmas/bulk" element={<BulkManagement />} />
      <Route path="rmas/processing" element={<ProcessingRmas />} />
      <Route path="rmas/manage" element={<ManageCases />} />

      {/* Customers */}
      <Route path="customers" element={<AdminCustomerList />} />
      <Route path="customers/create" element={<AdminCreateCustomer />} />
    </Route>
  );
}
