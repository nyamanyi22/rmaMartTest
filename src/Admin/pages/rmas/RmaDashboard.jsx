import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RmaTable from '../../Components/RmaTable';
import RmaFilters from '../../Components/RmaFilters';
import Pagination from '../../Components/Pagination';
import StatusBadge from '../../Components/StatusBadge';
import { fetchRmas, updateRmaStatus } from '../../api/rmaService';
import './styles/RmaDashboard.css';

const exportToCSV = (data) => {
  console.log("Exporting to CSV:", data);
  alert("Export to CSV initiated! (Check console for data)");
};

const RmaDashboard = () => {
  const [data, setData] = useState({
    rmas: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
    },
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: { start: '', end: '' },
    returnReason: '',
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async (page = data.pagination.currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchRmas({
        page,
        limit: data.pagination.itemsPerPage,
        filters: {
          search: filters.search,
          status: filters.status === 'all' ? '' : filters.status,
          startDate: filters.dateRange.start,
          endDate: filters.dateRange.end,
          returnReason: filters.returnReason,
        },
      });

      setData({
        rmas: response.data || [],
        pagination: {
          currentPage: response.current_page || 1,
          totalPages: response.last_page || 1,
          totalItems: response.total || 0,
          itemsPerPage: response.per_page || 20,
        },
      });
      setSelectedItems([]);
    } catch (err) {
      setError(err.message || 'Failed to fetch RMAs. Please try again.');
      console.error("Failed to fetch RMAs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, data.pagination.itemsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, fetchData]);

  useEffect(() => {
    fetchData();
  }, [data.pagination.itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage !== data.pagination.currentPage) {
      fetchData(newPage);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleViewItem = (item) => {
    navigate(`/admin/rma-requests/${item.id}`);
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedItems.length === 0) return;
    try {
      setIsLoading(true);
      await Promise.all(
        selectedItems.map((id) => updateRmaStatus(id, newStatus))
      );
      await fetchData(data.pagination.currentPage);
      setSelectedItems([]);
      alert(`Successfully updated status to '${newStatus}' for selected RMAs.`);
    } catch (err) {
      setError(err.message || 'Failed to update RMA status. Please try again.');
      console.error("Failed to update RMA status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'rmaNumber',
      label: 'RMA #',
      sortable: true,
      render: (value) => <span className="rma-number">{value}</span>,
    },
    {
      key: 'customer.name',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'createdAt',
      label: 'Date Created',
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString() : '-'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewItem(item);
          }}
          className="view-btn"
        >
          View
        </button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading RMA Data</h2>
        <p>{error}</p>
        <button onClick={() => fetchData(1)}>Retry</button>
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
            disabled={data.rmas.length === 0 && !isLoading}
          >
            Export All to CSV
          </button>
          {selectedItems.length > 0 && (
            <button
              className="export-btn"
              onClick={() =>
                exportToCSV(
                  data.rmas.filter((rma) => selectedItems.includes(rma.id))
                )
              }
            >
              Export Selected ({selectedItems.length})
            </button>
          )}
        </div>
      </header>

      <RmaFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        statusOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'completed', label: 'Completed' },
        ]}
      />

      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedItems.length} items selected</span>
          <select
            onChange={(e) => handleBulkStatusUpdate(e.target.value)}
            defaultValue=""
            className="bulk-status-select"
            disabled={isLoading}
          >
            <option value="" disabled>
              Update Status
            </option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
            <option value="processed">Mark as Processed</option>
          </select>
        </div>
      )}

      <RmaTable
        data={data.rmas}
        columns={columns}
        isLoading={isLoading}
        selectable={true}
        selectedItems={selectedItems}
        onSelectItems={setSelectedItems}
        onRowClick={handleViewItem}
        emptyState={
          <div className="empty-state">
            {filters.search || filters.status !== 'all' ||
            filters.dateRange.start || filters.dateRange.end ||
            filters.returnReason
              ? 'No matching RMAs found with current filters.'
              : 'No RMAs available.'}
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
