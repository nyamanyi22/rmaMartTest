import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RmaTable from '../../Components/RmaTable';
import { fetchRmas } from '.../rmaService';
import { useDebounce } from '../hooks/useDebounce';
import Pagination from '../../Components/Pagination';
import RefreshIcon from '../../assets/icons/refresh.svg';
import SearchIcon from '../../assets/icons/search.svg';
import './PendingRmas.css';

const PendingRmas = () => {
  // State management
  const [search, setSearch] = useState('');
  const [rmas, setRmas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  
  // Filter state
  const [filters, setFilters] = useState({
    status: 'pending', // Default to pending
    returnReason: null,
    dateRange: {
      start: null,
      end: null
    }
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0
  });

  const debouncedSearch = useDebounce(search, 300);

  // Status options with labels and colors
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#FFC107' },
    { value: 'approved', label: 'Approved', color: '#4CAF50' },
    { value: 'rejected', label: 'Rejected', color: '#F44336' },
    { value: 'processing', label: 'Processing', color: '#2196F3' },
    { value: 'completed', label: 'Completed', color: '#9C27B0' }
  ];

  // Fetch data with current filters
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchRmas({
        page: pagination.page,
        perPage: pagination.perPage,
        filters: {
          ...filters,
          search: debouncedSearch
        },
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
  }, [debouncedSearch, pagination.page, pagination.perPage, sort, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshToken]);

  // Handler functions
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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDateChange = (name, date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [name]: date }
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'pending',
      returnReason: null,
      dateRange: {
        start: null,
        end: null
      }
    });
    setSearch('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="pending-rmas-container">
      <div className="header-row">
        <div className="title-section">
          <h2>RMA Management</h2>
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={isLoading}
            aria-label="Refresh data"
          >
            <img src={RefreshIcon} alt="Refresh" />
          </button>
        </div>
        
        <div className="search-container">
          <img src={SearchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search RMAs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="status-select"
              disabled={isLoading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="returnReason">Return Reason</label>
            <select
              id="returnReason"
              value={filters.returnReason || ''}
              onChange={(e) => handleFilterChange(
                'returnReason', 
                e.target.value || null
              )}
              disabled={isLoading}
            >
              <option value="">All Reasons</option>
              <option value="Defective">Defective</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="No Longer Needed">No Longer Needed</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group date-filter-group">
            <label>Date Range</label>
            <div className="date-pickers">
              <DatePicker
                selected={filters.dateRange.start}
                onChange={(date) => handleDateChange('start', date)}
                selectsStart
                startDate={filters.dateRange.start}
                endDate={filters.dateRange.end}
                placeholderText="Start date"
                className="date-input"
                maxDate={new Date()}
                disabled={isLoading}
              />
              <span className="date-separator">to</span>
              <DatePicker
                selected={filters.dateRange.end}
                onChange={(date) => handleDateChange('end', date)}
                selectsEnd
                startDate={filters.dateRange.start}
                endDate={filters.dateRange.end}
                minDate={filters.dateRange.start}
                placeholderText="End date"
                className="date-input"
                maxDate={new Date()}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="reset-filters-btn"
            disabled={isLoading}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Section */}
      {error ? (
        <div className="error-message">
          {error}
          <button onClick={handleRefresh}>Retry</button>
        </div>
      ) : (
        <>
          <RmaTable
            data={rmas}
            isLoading={isLoading}
            sortConfig={sort}
            onSort={handleSort}
            onRowClick={(rma) => console.log('Clicked RMA:', rma)}
            emptyMessage={
              isLoading ? 'Loading RMAs...' : 
              search ? 'No matching RMAs found' : 
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
        </>
      )}
    </div>
  );
};

PendingRmas.propTypes = {
  // Add any prop types if this component receives props
};

export default PendingRmas;