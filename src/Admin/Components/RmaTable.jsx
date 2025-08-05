import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './styles/RmaTable.css';

const RmaTable = ({
  data = [],
  columns = [
    { key: 'rmaNumber', label: 'RMA Number', sortable: true },
    { key: 'customer.name', label: 'Customer', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'dateCreated', label: 'Date Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ],
  isLoading = false,
  selectable = true,
  selectedItems = [],
  onSelectItems = () => {},
  onRowClick = () => {},
  onViewItem = () => {},
  onPageChange = () => {},
  pagination = null, // added
  className = '',
  emptyState = <div className="empty-state">No RMAs available</div>
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'dateCreated',
    direction: 'desc'
  });

  const getNestedValue = (obj, path) =>
    path.split('.').reduce((o, p) => (o || {})[p], obj);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return data;
    const sortableData = [...data];

    return sortableData.sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const toggleSelection = (itemId) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];
    onSelectItems(newSelection);
  };

  const toggleSelectAll = (e) => {
    onSelectItems(e.target.checked ? data.map((item) => item.id) : []);
  };

  const handleRowClick = (item, e) => {
    if (!e.target.closest('input, button, .actions-cell')) {
      onRowClick(item);
    }
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(getNestedValue(item, column.key), item);
    }

    switch (column.key) {
      case 'status':
        return (
          <span className={`status-badge ${item.status?.toLowerCase()}`}>
            {item.status}
          </span>
        );
      case 'dateCreated':
        return new Date(item.dateCreated).toLocaleDateString();
      case 'actions':
        return (
          <div className="actions-cell">
            <button onClick={() => onViewItem(item)}>View</button>
          </div>
        );
      default:
        return getNestedValue(item, column.key) || '-';
    }
  };

  return (
    <div className={`rma-table-container ${className}`}>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : data.length === 0 ? (
        emptyState
      ) : (
        <>
          <table className="rma-table">
            <thead>
              <tr>
                {selectable && (
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length > 0 &&
                        selectedItems.length === data.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={col.sortable ? 'sortable' : ''}
                    onClick={col.sortable ? () => requestSort(col.key) : undefined}
                  >
                    {col.label}
                    {col.sortable &&
                      sortConfig.key === col.key &&
                      (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr
                  key={item.id}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                  onClick={(e) => handleRowClick(item, e)}
                >
                  {selectable && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={`${item.id}-${col.key}`}>{renderCellContent(item, col)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer summary and pagination */}
          <div className="table-footer mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {data.length} of {pagination?.total || data.length} RMAs
            </p>

            {pagination && pagination.total > pagination.per_page && (
              <div className="flex gap-2 items-center">
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => onPageChange(pagination.current_page - 1)}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => onPageChange(pagination.current_page + 1)}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

RmaTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  isLoading: PropTypes.bool,
  selectable: PropTypes.bool,
  selectedItems: PropTypes.array,
  onSelectItems: PropTypes.func,
  onRowClick: PropTypes.func,
  onViewItem: PropTypes.func,
  onPageChange: PropTypes.func,
  pagination: PropTypes.object,
  className: PropTypes.string,
  emptyState: PropTypes.node
};

export default RmaTable;
