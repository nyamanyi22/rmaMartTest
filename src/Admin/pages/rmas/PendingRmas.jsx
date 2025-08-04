import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types'; // Keep PropTypes if your component were to receive props
import RmaTable from '../../Components/RmaTable';
import { fetchRmas } from '../../api/rmaService';
import { useDebounce } from '../../hooks/useDebounce';
import Pagination from '../../Components/Pagination';
import RmaFilters from '../../Components/RmaFilters'; // Make sure this path is correct
import { HiArrowPath } from 'react-icons/hi2'; // HiMagnifyingGlass is no longer directly used here

import './styles/PendingRma.css';

const PendingRmas = () => {
  // Consolidate all filter states into a single object
  const [filters, setFilters] = useState({
    search: '',
    status: 'pending', // Default to 'pending' as it's the PendingRmas view
    dateRange: { start: null, end: null },
    returnReason: null // Or '' based on your preference for null/empty string
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

  // Debounce the entire filters object
  const debouncedFilters = useDebounce(filters, 300);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Extract specific filters for the API call
      // Ensure dateRange start/end are converted to a suitable format if needed by your API (e.g., ISO string)
      const apiFilters = {
        status: debouncedFilters.status,
        search: debouncedFilters.search,
        returnReason: debouncedFilters.returnReason,
        // Convert dates to ISO strings for API if your backend expects them
        startDate: debouncedFilters.dateRange.start ? debouncedFilters.dateRange.start.toISOString() : undefined,
        endDate: debouncedFilters.dateRange.end ? debouncedFilters.dateRange.end.toISOString() : undefined,
      };

      const response = await fetchRmas({
        page: pagination.page,
        perPage: pagination.perPage,
        filters: apiFilters, // Pass the consolidated filters
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
      console.error('Error fetching RMAs:', err);
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

  // New handler for RmaFilters to update the main filters state
  const handleFilterChange = useCallback((newFilters) => {
    // Only update filters if they are different to avoid unnecessary re-renders/debounces
    setFilters(prev => {
      // Deep comparison might be needed for dateRange or complex objects
      const isChanged = Object.keys(newFilters).some(key => prev[key] !== newFilters[key]);
      if (isChanged || JSON.stringify(prev.dateRange) !== JSON.stringify(newFilters.dateRange)) {
        return { ...prev, ...newFilters };
      }
      return prev;
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Always reset page to 1 on filter change
  }, []);

  // Handler to reset all filters
  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all', // Reset status to 'all' or 'pending' depending on default view preference
      dateRange: { start: null, end: null },
      returnReason: null
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset page to 1
  }, []);

  // Placeholder for onSavePreset - you'll implement this functionality
  const handleSavePreset = useCallback((preset) => {
    console.log('Saving preset:', preset);
    // In a real app, you would send this to a backend or store in local storage
  }, []);


  // Determine if any filters are active (excluding the default 'pending' status if that's the base view)
  const isAnyFilterActive =
    debouncedFilters.search ||
    (debouncedFilters.status && debouncedFilters.status !== 'pending') || // Check if status is not default 'pending'
    debouncedFilters.returnReason ||
    debouncedFilters.dateRange.start ||
    debouncedFilters.dateRange.end;


  return (
    <div className="pending-rmas-container">
      <div className="header-row">
        <div className="title-section">
          <h2>Pending RMAs</h2>
          <button
            onClick={handleRefresh}
            className="refresh-button"
            disabled={isLoading}
          >
            <HiArrowPath size={20} className="icon" />
          </button>
        </div>

        {/* Render RmaFilters component */}
        <div className="full-width-filters-section"> {/* Added a wrapper div for styling */}
          <RmaFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            onSavePreset={handleSavePreset} // Pass the preset save handler
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
          onRowClick={(rma) => console.log('Clicked RMA:', rma)}
          emptyMessage={
            isLoading
              ? 'Loading RMAs...'
              : isAnyFilterActive // Use the combined check
                ? 'No matching RMAs found for the applied filters'
                : 'No pending RMAs available' // Original default message
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

PendingRmas.propTypes = {
  // No specific props for this container component, but good to keep if it changes
};

export default PendingRmas;