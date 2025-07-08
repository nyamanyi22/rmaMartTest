import { useState, useEffect, useCallback } from 'react';
import RmaTable from '../../Components/RmaTable';
import BulkAction from '../../Components/BulkAction';
import Pagination from '../../Components/Pagination';
import RmaFilters from '../../Components/RmaFilters';
import { fetchRmas, bulkUpdateRma, exportRmas } from '../../rmaService';
import { useDebounce } from '../../hooks/useDebounce';
import { HiArrowPath, HiMagnifyingGlass } from 'react-icons/hi2';
import './styles/BulkManagement.css';

const BulkManagement = () => {
  const [rmas, setRmas] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    returnReason: '',
    dateRange: {
      start: null,
      end: null
    }
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchData = useCallback(async () => {
    const abortController = new AbortController();

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchRmas({
        page: pagination.page,
        perPage: pagination.perPage,
        filters: {
          search: debouncedSearch,
          status: filters.status === 'all' ? null : filters.status,
          returnReason: filters.returnReason || null,
          dateFrom: filters.dateRange.start,
          dateTo: filters.dateRange.end
        },
        sort,
        signal: abortController.signal
      });

      if (!abortController.signal.aborted) {
        setRmas(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total,
          page: response.page
        }));
        if (pagination.page !== response.page || debouncedSearch) {
          setSelectedIds([]);
        }
      }
    } catch (err) {
      if (!abortController.signal.aborted) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch RMAs');
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }

    return () => abortController.abort();
  }, [pagination.page, pagination.perPage, debouncedSearch, sort, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshToken]);

  const handleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
      return Array.from(newSelection);
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.length === rmas.length ? [] : rmas.map(rma => rma.id)
    );
  }, [rmas]);

  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleSort = useCallback((field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshToken(Date.now());
  }, []);

  const handleBulkAction = async (action) => {
    if (!selectedIds.length) return;

    try {
      setIsLoading(true);
      await bulkUpdateRma(selectedIds, action);
      setSelectedIds([]);
      setRefreshToken(Date.now());
    } catch (err) {
      alert(`Failed to ${action}: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (ids = null) => {
    try {
      setIsExporting(true);
      const exportIds = ids || selectedIds;
      const blob = await exportRmas(exportIds.length ? exportIds : null);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RMAs_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedIds([]);
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectAll]);

return (
  <div className="bulk-management-container">
    <div className="header-row">
      <div className="title-section">
        <h2>Bulk RMA Management</h2>
        <button 
          onClick={handleRefresh} 
          className="icon-button"
          disabled={isLoading}
          aria-label="Refresh data"
        >
          <HiArrowPath size={20} className="icon" />
        </button>
      </div>

      <div className="controls">
        <RmaFilters
          filters={filters}
          onFilterChange={(updatedFilters) => {
            setFilters(updatedFilters);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          onReset={() => {
            setFilters({
              search: '',
              status: 'all',
              returnReason: '',
              dateRange: { start: null, end: null }
            });
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          onSavePreset={(preset) => {
            console.log('Saved preset:', preset);
          }}
        />

        <button 
          onClick={() => handleExport()} 
          className="icon-button"
          disabled={isExporting}
          aria-label="Export data"
        >
          <HiArrowDownTray size={20} className="icon" />
        </button>
      </div>
    </div>

    {error && (
      <div className="error-message">
        {error}
        <button onClick={handleRefresh}>Retry</button>
      </div>
    )}

    <RmaTable
      data={rmas}
      isLoading={isLoading}
      sortConfig={sort}
      onSort={handleSort}
      onSelect={handleSelect}
      onSelectAll={handleSelectAll}
      selectedIds={selectedIds}
      emptyMessage={
        isLoading ? 'Loading RMAs...' : 
        debouncedSearch ? 'No matching RMAs found' : 
        'No RMAs available with current filters'
      }
    />

    {pagination.total > 0 && (
      <div className="pagination-container">
        <div className="results-count">
          Showing {(pagination.page - 1) * pagination.perPage + 1}-
          {Math.min(pagination.page * pagination.perPage, pagination.total)} 
          of {pagination.total} RMAs
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.perPage)}
          onPageChange={handlePageChange}
          disabled={isLoading}
        />
      </div>
    )}

    <BulkAction
      selectedCount={selectedIds.length}
      onApprove={() => handleBulkAction('approve')}
      onReject={() => {
        if (confirm(`Reject ${selectedIds.length} selected RMAs?`)) {
          handleBulkAction('reject');
        }
      }}
      onProcess={() => handleBulkAction('processing')}
      onClearSelection={() => setSelectedIds([])}
      isProcessing={isLoading}
      customActions={[
        {
          label: `Export Selected (${selectedIds.length})`,
          action: () => handleExport(selectedIds),
          className: 'export-btn'
        }
      ]}
    />
  </div>
);
}
export default BulkManagement;
