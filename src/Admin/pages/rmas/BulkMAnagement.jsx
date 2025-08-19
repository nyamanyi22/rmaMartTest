import { useState, useEffect, useCallback } from 'react';
import RmaTable from '../../Components/RmaTable';
import ConfirmableBulkAction from '../../Components/ConfirmableBulkAction';
import Pagination from '../../Components/Pagination';
import RmaFilters from '../../Components/RmaFilters';
import { fetchRmas, bulkUpdateRmaStatus as bulkUpdateRma, exportRmas } from '../../api/rmaService';
import { useDebounce } from '../../hooks/useDebounce';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/BulkManagement.css';

const BulkManagement = () => {
  const [rmas, setRmas] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    returnReason: '',
    dateRange: { start: null, end: null },
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchData = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchRmas({
        page: pagination.page,
        limit: pagination.perPage,
        filters: {
          search: debouncedSearch,
          status: filters.status === 'all' ? null : filters.status,
          returnReason: filters.returnReason || null,
          startDate: filters.dateRange.start,
          endDate: filters.dateRange.end
        },
        signal
      });

      if (!signal.aborted) {
        setRmas(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.total,
          page: response.current_page
        }));
        setSelectedIds([]);
      }
    } catch (err) {
      if (!signal.aborted) {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch RMAs';
        setError(msg);
        toast.error(msg);
      }
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }, [pagination.page, debouncedSearch, filters]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData, refreshToken]);

  const handleSelectItems = (ids) => setSelectedIds(ids);

  const handleRefresh = () => setRefreshToken(Date.now());

  const handleBulkAction = async (action) => {
    if (!selectedIds.length) {
      toast.info('No RMAs selected.');
      return;
    }

    try {
      setIsLoading(true);

      // Convert selectedIds to numbers
      const ids = selectedIds.map(id => Number(id));

      // Map friendly action names to backend enum values
      const statusMap = {
  approve: 'APPROVED',
  approved: 'APPROVED',

  reject: 'REJECTED',
  rejected: 'REJECTED',

  complete: 'COMPLETED',
  completed: 'COMPLETED',

  pending: 'PENDING',

  process: 'PROCESSING',
  processing: 'PROCESSING',
  processed: 'PROCESSING'
};


      const status = statusMap[action.toLowerCase()];
      if (!status) throw new Error(`Invalid action: ${action}`);

      await bulkUpdateRma(ids, status); // send correct payload
      setSelectedIds([]);
      setRefreshToken(Date.now());
      toast.success(`Successfully updated ${ids.length} RMA(s) to ${status}`);
    } catch (err) {
      toast.error(`Failed to ${action}: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (ids = []) => {
    try {
      if (!rmas.length) {
        toast.info('No data available to export.');
        return;
      }
      setIsExporting(true);

      const blob = await exportRmas({
        ids: ids.length ? ids : null,
        search: filters.search,
        status: filters.status === 'all' ? null : filters.status,
        returnReason: filters.returnReason || null,
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RMAs_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Export successful!');
    } catch (err) {
      toast.error(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bulk-management-container">
      <div className="header-row">
        <h2>Bulk RMA Management</h2>
        <div className="controls">
          <RmaFilters
            filters={filters}
            onFilterChange={(updated) => { setFilters(updated); setPagination(p => ({ ...p, page: 1 })); }}
            onReset={() => {
              setFilters({ search: '', status: 'all', returnReason: '', dateRange: { start: null, end: null } });
              setPagination(p => ({ ...p, page: 1 }));
            }}
          />
          <button onClick={handleExport} disabled={isExporting}>Export</button>
          <button onClick={handleRefresh} disabled={isLoading}>Refresh</button>
        </div>
      </div>

      {error && <div className="error-message">{error} <button onClick={handleRefresh}>Retry</button></div>}

      <RmaTable
        data={rmas}
        isLoading={isLoading}
        selectable
        selectedItems={selectedIds}
        onSelectItems={handleSelectItems}
        onRowClick={(item) => {
          const id = Number(item.id);
          if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
          } else {
            setSelectedIds([...selectedIds, id]);
          }
        }}
      />

      {pagination.total > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.perPage)}
          onPageChange={(page) => setPagination(p => ({ ...p, page }))}
        />
      )}

      <ConfirmableBulkAction
        selectedIds={selectedIds}
        allData={rmas}
        isLoading={isLoading}
        onClearSelection={() => setSelectedIds([])}
        handleBulkAction={handleBulkAction}
        handleExport={handleExport}
      />

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default BulkManagement;
