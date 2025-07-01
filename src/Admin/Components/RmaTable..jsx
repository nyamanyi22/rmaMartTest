import { useState } from 'react';
import './RmaTable.css';

const RmaTable = ({
  data = [],
  selectedItems = [],
  onSelectItems,
  onViewItem,
  columns = [
    { key: 'rmaNumber', label: 'RMA Number', sortable: true },
    { key: 'customer.name', label: 'Customer', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'dateCreated', label: 'Date Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ],
  selectable = true,
  className = '',
  emptyState = <div className="empty-state">No data available</div>,
  onRowClick
}) => {
  const [sortConfig, setSortConfig] = useState({ 
    key: 'dateCreated', 
    direction: 'desc' 
  });

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, p) => (o || {})[p], obj);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);
    
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
    if (onRowClick) {
      // Ignore clicks on checkboxes or actions
      if (e.target.tagName !== 'INPUT' && !e.target.closest('.actions-cell')) {
        onRowClick(item);
      }
    }
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(getNestedValue(item, column.key), item);
    }

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
            <button 
              onClick={() => onViewItem(item)}
              className="view-button"
            >
              View
            </button>
          </div>
        );
      default:
        return getNestedValue(item, column.key) || '-';
    }
  };

  return (
    <div className={`rma-table-container ${className}`}>
      {data.length === 0 ? (
        emptyState
      ) : (
        <table className="rma-table">
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
                  style={{ width: column.width || 'auto' }}
                >
                  <div className="header-content">
                    {column.label}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
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
                    className={`${column.key}-cell ${column.key === 'actions' ? 'actions-cell' : ''}`}
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

export default RmaTable;