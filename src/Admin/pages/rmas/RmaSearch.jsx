import { useState, useEffect } from 'react';
import RmaFilters from '../../Components/RmaFilters';
import RmaTable from '../../Components/RmaTable';
import { fetchRmas } from '../../api/rmaService';
import { useDebounce } from '../../hooks/useDebounce';
import './styles/RmaSearch.css';

const RmaSearch = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: { start: null, end: null },
    returnReason: ''
  });
  const [rmas, setRmas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchRmas({
          page: pagination.page,
          perPage: pagination.perPage,
          filters: {
            search: debouncedSearch,
            status: filters.status !== 'all' ? filters.status : undefined,
            startDate: filters.dateRange.start,
            endDate: filters.dateRange.end,
            returnReason: filters.returnReason
          }
        });

        setRmas(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total,
          page: response.page
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [debouncedSearch, filters, pagination.page, pagination.perPage]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterPreset = (preset) => {
    setFilters(preset);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="rma-search-container">
    
     <div className="search-header">
    
        <h2>RMA Management</h2>
        <div className="header-actions">
          <button className="export-btn" onClick={() => exportToCSV(rmas)}>
            Export Results
          </button>
        </div>
      </div>

      <RmaFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => {
          setFilters({
            search: '',
            status: 'all',
            dateRange: { start: null, end: null },
            returnReason: ''
          });
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        onSavePreset={(preset) => handleFilterPreset(preset)}
      />

      {error ? (
        <div className="error-message">
          Error loading RMAs: {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <RmaTable
          data={rmas}
          isLoading={isLoading}
          onRowClick={(rma) => navigate(`/rmas/${rma.id}`)}
          emptyMessage={
            filters.search || filters.status !== 'all' || filters.dateRange.start
              ? 'No matching RMAs found'
              : 'No RMAs available'
          }
        />
      )}

      {pagination.total > 0 && (
        <div className="pagination-container">
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.perPage)}
            onPageChange={handlePageChange}
          />
          <div className="per-page-selector">
            <span>Items per page:</span>
            <select
              value={pagination.perPage}
              onChange={(e) => setPagination(prev => ({
                ...prev,
                perPage: Number(e.target.value),
                page: 1
              }))}
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      )}
        
    </div>
  );
};

export default RmaSearch;