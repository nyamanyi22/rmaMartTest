import { useState, useEffect, useCallback } from 'react';
import RmaTable from './RmaTable';
import { fetchRmas, bulkUpdateRmaStatus } from '../rmaService';
import { useDebounce } from '../hooks/useDebounce';
import Pagination from './Pagination'; // Assuming you have this locally

const ProcessingRmas = () => {
  // State management
  const [search, setSearch] = useState('');
  const [rmas, setRmas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  const [selectedRmas, setSelectedRmas] = useState([]);
  const [statusFilter, setStatusFilter] = useState('processing');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0
  });

  const debouncedSearch = useDebounce(search, 300);

  // Fetch data with abort controller
  const fetchData = useCallback(async () => {
    const abortController = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchRmas({
        page: pagination.page,
        perPage: pagination.perPage,
        filters: {
          status: statusFilter,
          search: debouncedSearch,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString()
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
        setSelectedRmas([]);
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
  }, [pagination.page, pagination.perPage, debouncedSearch, sort, statusFilter, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshToken]);

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (!selectedRmas.length) return;
    
    try {
      setIsBulkUpdating(true);
      await bulkUpdateRmaStatus(selectedRmas, newStatus);
      setNotification({
        type: 'success',
        message: `Updated ${selectedRmas.length} RMAs to ${newStatus.replace('_', ' ')}`
      });
      setRefreshToken(Date.now());
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Bulk update failed'
      });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Handlers
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

  const handleSelect = useCallback((id) => {
    setSelectedRmas(prev => {
      const newSelection = new Set(prev);
      newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
      return Array.from(newSelection);
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedRmas(prev => 
      prev.length === rmas.length ? [] : rmas.map(rma => rma.id)
    );
  }, [rmas]);

  // Simple date picker component (inline implementation)
  const SimpleDatePicker = ({ value, onChange, placeholder }) => (
    <input
      type="date"
      value={value?.toISOString().split('T')[0] || ''}
      onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
      placeholder={placeholder}
      className="date-input"
    />
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedRmas([]);
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRefresh]);

  return (
    <div className="processing-rmas-container">
      {/* Notification area */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* Header with controls */}
      <div className="header-row">
        <div className="title-section">
          <h2>Processing RMAs</h2>
          <button 
            onClick={handleRefresh} 
            className="icon-button"
            disabled={isLoading}
            aria-label="Refresh data"
          >
            🔄
            <span className="keyboard-hint">(Ctrl+R)</span>
          </button>
        </div>

        <div className="controls-section">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={isLoading}
            className="status-filter"
          >
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="awaiting_parts">Awaiting Parts</option>
            <option value="quality_check">Quality Check</option>
          </select>

          <div className="date-range-picker">
            <SimpleDatePicker
              value={dateRange.start}
              onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
              placeholder="Start date"
            />
            <span>to</span>
            <SimpleDatePicker
              value={dateRange.end}
              onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              placeholder="End date"
            />
          </div>

          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search RMAs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              className="search-input"
              aria-label="Search RMAs"
            />
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {/* Main RMA table */}
      <RmaTable
        data={rmas}
        isLoading={isLoading}
        sortConfig={sort}
        onSort={handleSort}
        selectable={true}
        selectedItems={selectedRmas}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        emptyMessage={
          isLoading ? (
            <div className="loading-state">
              <div className="spinner">Loading...</div>
            </div>
          ) : debouncedSearch ? (
            <div className="empty-state">
              <div className="empty-icon">❌</div>
              <p>No RMAs match your search</p>
              <button 
                onClick={() => setSearch('')}
                className="clear-search-btn"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p>No RMAs in {statusFilter.replace('_', ' ')} status</p>
            </div>
          )
        }
      />

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="pagination-container">
          <div className="results-count">
            Showing {(pagination.page - 1) * pagination.perPage + 1}-
            {Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total} RMAs
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.perPage)}
            onPageChange={handlePageChange}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedRmas.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedRmas.length} selected</span>
          <div className="action-buttons">
            <button
              onClick={() => handleBulkStatusUpdate('completed')}
              disabled={isBulkUpdating}
            >
              {isBulkUpdating ? 'Processing...' : 'Complete'}
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('on_hold')}
              disabled={isBulkUpdating}
            >
              Hold
            </button>
            <button
              onClick={() => setSelectedRmas([])}
              disabled={isBulkUpdating}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingRmas;