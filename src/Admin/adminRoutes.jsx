import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import RmaListPage from './pages/rmas/RmaListPage';
import RmaDetailPage from './pages/rmas/RmaDetailPage';
// ... import others

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      
      {/* RMA Management */}
      <Route path="/rmas" element={<RmaListPage />} />
      <Route path="/rmas/search" element={<RmaListPage />} />
      <Route path="/rmas/pending" element={<PendingRmasPage />} />
      <Route path="/rmas/approved" element={<ApprovedRmasPage />} />
      <Route path="/rmas/rejected" element={<RejectedRmasPage />} />
      <Route path="/rmas/bulk-actions" element={<BulkActionsPage />} />
      <Route path="/rmas/:rmaId" element={<RmaDetailPage />} />

      {/* Customers */}
      <Route path="/customers/list" element={<CustomerListPage />} />
      <Route path="/customers/import" element={<CustomerImportPage />} />

      {/* Products */}
      <Route path="/products/list" element={<ProductListPage />} />
      <Route path="/products/serial-numbers" element={<SerialNumbersPage />} />

      {/* Reports */}
      <Route path="/reports/rma-volume" element={<RmaVolumeReportPage />} />
      <Route path="/reports/turnaround" element={<TurnaroundTimeReportPage />} />
      <Route path="/reports/reason-codes" element={<ReturnReasonsReportPage />} />

      {/* Settings */}
      <Route path="/settings/general" element={<GeneralSettingsPage />} />
      <Route path="/settings/shipping" element={<ShippingSettingsPage />} />
      <Route path="/settings/return-reasons" element={<ReturnReasonsPage />} />
    </Routes>
  );
}
