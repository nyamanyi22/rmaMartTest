import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import RmaTable from '../../Components/RmaTable';
import { fetchRmas } from '.../rmaService'; // Adjust the import path as necessary
import { useDebounce } from '../hooks/useDebounce';
import Pagination from '../../Components/Pagination';
import RmaFilters from '../../components/RFilter';
import RefreshIcon from '../../assets/icons/refresh.svg';
import SearchIcon from '../../assets/icons/search.svg';
import './styles/PendingRmas.css';

const PendingRmas = () => {
  const [search, setSearch] = useState('');
  const [rmas, setRmas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  const [statusFilter, setStatusFilter] = useState('pending');
  
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0
  });

  const debouncedSearch = useDebounce(search, 300);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchRmas({
        page: pagination.page,
        perPage: pagination.perPage,
        filters: {
          status: statusFilter,
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
  }, [debouncedSearch, pagination.page, pagination.perPage, sort, statusFilter]);

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

  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

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
            <img src={RefreshIcon} alt="Refresh" />
          </button>
        </div>
        
        <div className="controls-section">
          <StatusFilter 
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'awaiting_parts', label: 'Awaiting Parts' }
            ]}
          />
          
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
            isLoading ? 'Loading RMAs...' : 
            debouncedSearch ? 'No matching RMAs found' : 
            'No RMAs available'
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
  // Add prop types if this component receives any props
};

export default PendingRmas;