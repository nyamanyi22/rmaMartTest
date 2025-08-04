import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RmaTable from '../../Components/RmaTable';
import RmaFilters from '../../Components/RmaFilters';
import Pagination from '../../Components/Pagination';
import StatusBadge from '../../Components/StatusBadge';
import { fetchRmas, updateRmaStatus } from '../../api/rmaService';
import './styles/RmaDashboard.css';


// This function will likely be defined elsewhere or handled by a utility.
// For now, let's keep a placeholder.
const exportToCSV = (data) => {
  console.log("Exporting to CSV:", data);
  // Implement actual CSV export logic here
  alert("Export to CSV initiated! (Check console for data)");
};

const RmaDashboard = () => {
  const [data, setData] = useState({
    rmas: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20 // Default items per page
    }
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // 'all' or specific status string
    dateRange: { start: '', end: '' }, // Use empty string for no date selected
    returnReason: '' // From snippet 1, if applicable
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Unified fetchData for server-side operations
  const fetchData = useCallback(async (page = data.pagination.currentPage) => {
    try {
      setIsLoading(true);
      setError(null); // Clear previous errors
      const response = await fetchRmas({
        page,
        limit: data.pagination.itemsPerPage,
        filters: { // Pass all filters here
          search: filters.search,
          status: filters.status === 'all' ? '' : filters.status, // Adjust for API expectations
          startDate: filters.dateRange.start,
          endDate: filters.dateRange.end,
          returnReason: filters.returnReason
        }
      });

      // Map Laravel's pagination keys to your state keys
      setData({
        rmas: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          itemsPerPage: response.meta.per_page
        }
      });
      setSelectedItems([]); // Clear selection on new data fetch
    } catch (err) {
      setError(err.message || 'Failed to fetch RMAs. Please try again.');
      console.error("Failed to fetch RMAs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, data.pagination.itemsPerPage, data.pagination.currentPage]); // Added currentPage as a dependency

  // Debounce filter changes and trigger a refetch from page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1); // Always go to page 1 when filters change
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, fetchData]);

  // Initial data fetch on component mount (or when itemsPerPage changes for the first time)
  useEffect(() => {
    // This effect runs only once or when itemsPerPage changes initially
    // The debounced effect above handles subsequent filter changes
    fetchData();
  }, [data.pagination.itemsPerPage]); // Only fetch on mount and itemsPerPage changes

  const handlePageChange = (newPage) => {
    // Only fetch if page actually changes to avoid unnecessary re-fetches
    if (newPage !== data.pagination.currentPage) {
      fetchData(newPage);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleViewItem = (item) => {
    // Corrected navigation to match the backend route
    navigate(`/admin/rma-requests/${item.id}`);
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedItems.length === 0) return;

    try {
      setIsLoading(true); // Indicate loading for bulk action
      await Promise.all(
        selectedItems.map(id => updateRmaStatus(id, newStatus))
      );
      // After successful update, re-fetch data to reflect changes
      await fetchData(data.pagination.currentPage);
      setSelectedItems([]); // Clear selection after bulk action
      alert(`Successfully updated status to '${newStatus}' for selected RMAs.`);
    } catch (err) {
      setError(err.message || 'Failed to update RMA status. Please try again.');
      console.error("Failed to update RMA status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Columns definition, now using StatusBadge component
  const columns = [
    {
      key: 'rmaNumber',
      label: 'RMA #',
      sortable: true,
      render: (value) => <span className="rma-number">{value}</span>
    },
    {
      key: 'customer.name',
      label: 'Customer',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'createdAt', // Assuming 'createdAt' from snippet 1 matches 'dateCreated' from snippet 2's data
      label: 'Date Created',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, item) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleViewItem(item); }} // Prevent row click from firing
          className="view-btn"
        >
          View
        </button>
      )
    }
  ];

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading RMA Data</h2>
        <p>{error}</p>
        <button onClick={() => fetchData(1)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rma-dashboard">

      <header className="dashboard-header">
        <h1>RMA Management</h1>
        <div className="header-actions">
          <button
            className="export-btn"
            onClick={() => exportToCSV(data.rmas)}
            disabled={data.rmas.length === 0 && !isLoading} // Disable if no data
          >
            Export All to CSV
          </button>
          {selectedItems.length > 0 && (
            <button
              className="export-btn"
              onClick={() => exportToCSV(data.rmas.filter(rma => selectedItems.includes(rma.id)))}
            >
              Export Selected ({selectedItems.length})
            </button>
          )}
        </div>
      </header>

      {/* RmaFilters component from Snippet 1 (assuming it handles search, status, dateRange) */}
      <RmaFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        statusOptions={[ // Provide status options, possibly from a config or API
          { value: 'all', label: 'All Statuses' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'completed', label: 'Completed' }
        ]}
      />

      {/* Bulk actions dropdown for status update */}
      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedItems.length} items selected</span>
          <select
            onChange={(e) => handleBulkStatusUpdate(e.target.value)}
            defaultValue=""
            className="bulk-status-select"
            disabled={isLoading}
          >
            <option value="" disabled>Update Status</option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
            <option value="processed">Mark as Processed</option>
            {/* Add other status options as needed */}
          </select>
        </div>
      )}

      {/* Enhanced RmaTable component from Snippet 2 */}
      <RmaTable
        data={data.rmas}
        columns={columns}
        isLoading={isLoading}
        selectable={true}
        selectedItems={selectedItems}
        onSelectItems={setSelectedItems}
        onRowClick={handleViewItem} // Row click for viewing details
        emptyState={
          <div className="empty-state">
            {(filters.search || filters.status !== 'all' || filters.dateRange.start || filters.dateRange.end || filters.returnReason)
              ? 'No matching RMAs found with current filters.'
              : 'No RMAs available.'
            }
          </div>
        }
      />

      <Pagination
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <div className="mt-2 text-sm text-gray-600 text-center">
        Showing {data.rmas.length} of {data.pagination.totalItems} RMAs
      </div>

    </div>
  );
};

export default RmaDashboard;
