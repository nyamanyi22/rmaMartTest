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
  className = '',
  emptyState = <div className="empty-state">No data available</div>
}) => {
  const [sortConfig, setSortConfig] = useState({ 
    key: 'dateCreated', 
    direction: 'desc' 
  });

  const sortedData = useMemo(() => {
    const sortableData = [...data];
    if (!sortConfig) return sortableData;

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

  const getNestedValue = (obj, path) => 
    path.split('.').reduce((o, p) => (o || {})[p], obj);

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelection = (itemId) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectItems(newSelection);
  };

  const toggleSelectAll = (e) => {
    onSelectItems(e.target.checked ? data.map(item => item.id) : []);
  };

  const handleRowClick = (item, e) => {
    if (!e.target.closest('input, button, .actions-cell')) {
      onRowClick(item);
    }
  };

  const renderCellContent = (item, column) => {
    if (column.render) return column.render(getNestedValue(item, column.key), item);
    
    switch (column.key) {
      case 'status':
        return (
          <span className={`status-badge ${item.status.toLowerCase()}`}>
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
      {isLoading && <div className="loading-overlay">Loading...</div>}
      
      {data.length === 0 ? (
        emptyState
      ) : (
        <table className="rma-table">
          {/* Table header */}
          <thead>
            <tr>
              {selectable && (
                <th className="select-column">
                  <input 
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedItems.length === data.length && data.length > 0}
                  />
                </th>
              )}
              {columns.map(column => (
                <th 
                  key={column.key}
                  onClick={() => column.sortable && requestSort(column.key)}
                  className={column.sortable ? 'sortable' : ''}
                >
                  <div className="header-content">
                    {column.label}
                    {column.sortable && (
                      <span className="sort-icon">
                        {sortConfig.key === column.key 
                          ? (sortConfig.direction === 'asc' ? '↑' : '↓')
                          : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody>
            {sortedData.map(item => (
              <tr 
                key={item.id} 
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                onClick={(e) => handleRowClick(item, e)}
              >
                {selectable && (
                  <td className="select-column">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td 
                    key={`${item.id}-${column.key}`}
                    className={`${column.key}-cell`}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

RmaTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func
    })
  ),
  isLoading: PropTypes.bool,
  selectable: PropTypes.bool,
  selectedItems: PropTypes.array,
  onSelectItems: PropTypes.func,
  onRowClick: PropTypes.func,
  onViewItem: PropTypes.func,
  className: PropTypes.string,
  emptyState: PropTypes.node
};

export default RmaTable;