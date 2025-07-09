import { useState, useEffect, useCallback } from 'react';
import RmaTable from '../../Components/RmaTable';
import { fetchRmas } from '../../rmaService';
import { useDebounce } from '../../hooks/useDebounce';
import Pagination from '../../Components/Pagination';
import RmaFilters from '../../Components/RmaFilters';
import { HiArrowPath } from 'react-icons/hi2';

import './styles/PendingRma.css';// Make sure this CSS file exists (you can copy from PendingRma.css)

const ApprovedRmas = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'approved', // ✅ Change to 'approved'
    dateRange: { start: null, end: null },
    returnReason: null
  });
  const [rmas, setRmas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0
  });

  const debouncedFilters = useDebounce(filters, 300);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiFilters = {
        status: debouncedFilters.status,
        search: debouncedFilters.search,
        returnReason: debouncedFilters.returnReason,
        startDate: debouncedFilters.dateRange.start ? debouncedFilters.dateRange.start.toISOString() : undefined,
        endDate: debouncedFilters.dateRange.end ? debouncedFilters.dateRange.end.toISOString() : undefined,
      };

      const response = await fetchRmas({
        page: pagination.page,
        perPage: pagination.perPage,
        filters: apiFilters,
        sort
      });

      setRmas(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        page: response.page
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch RMAs');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters, pagination.page, pagination.perPage, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshToken]);

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

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => {
      const isChanged = Object.keys(newFilters).some(key => prev[key] !== newFilters[key]);
      if (isChanged || JSON.stringify(prev.dateRange) !== JSON.stringify(newFilters.dateRange)) {
        return { ...prev, ...newFilters };
      }
      return prev;
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'approved',
      dateRange: { start: null, end: null },
      returnReason: null
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSavePreset = useCallback((preset) => {
    console.log('Saving approved RMA filter preset:', preset);
  }, []);

  const isAnyFilterActive =
    debouncedFilters.search ||
    debouncedFilters.returnReason ||
    debouncedFilters.dateRange.start ||
    debouncedFilters.dateRange.end;

  return (
    <div className="approved-rmas-container">
      <div className="header-row">
        <div className="title-section">
          <h2>Approved RMAs</h2>
          <button
            onClick={handleRefresh}
            className="refresh-button"
            disabled={isLoading}
          >
            <HiArrowPath size={20} className="icon" />
          </button>
        </div>

        <div className="full-width-filters-section">
          <RmaFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            onSavePreset={handleSavePreset}
          />
        </div>
      </div>

      {error ? (
        <div className="error-message">
          {error}
          <button onClick={handleRefresh}>Retry</button>
        </div>
      ) : (
        <RmaTable
          data={rmas}
          isLoading={isLoading}
          sortConfig={sort}
          onSort={handleSort}
          onRowClick={(rma) => console.log('Clicked Approved RMA:', rma)}
          emptyMessage={
            isLoading
              ? 'Loading RMAs...'
              : isAnyFilterActive
                ? 'No matching approved RMAs found'
                : 'No approved RMAs available'
          }
        />
      )}

      {pagination.total > 0 && (
        <div className="pagination-container">
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.perPage)}
            onPageChange={handlePageChange}
            disabled={isLoading}
          />
          <div className="results-count">
            Showing {(pagination.page - 1) * pagination.perPage + 1}-
            {Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total} RMAs
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedRmas;
