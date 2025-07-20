// src/Components/GenericTable.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable table component for displaying lists of data.
 * It handles rendering headers, rows, and common actions like Edit/Delete.
 *
 * @param {object} props
 * @param {Array<object>} props.data - The array of items to display.
 * @param {Array<object>} props.columns - Configuration for table columns.
 * Each column object: { key: string, label: string, render?: (item: object) => React.Node }
 * @param {boolean} props.isLoading - Whether data is currently loading.
 * @param {string} props.emptyMessage - Message to display when no data is found.
 * @param {function} [props.onEdit] - Callback for edit action. Receives item.id.
 * @param {function} [props.onDelete] - Callback for delete action. Receives item.id.
 * @param {function} [props.onView] - Callback for view action. Receives item.id.
 * @param {string} [props.idKey='id'] - The key in data items that serves as a unique ID.
 */
const GenericTable = ({
  data,
  columns,
  isLoading,
  emptyMessage,
  onEdit,
  onDelete,
  onView,
  idKey = 'id', // Default to 'id' for key prop
}) => {
  if (isLoading) {
    return (
      <div className="table-container"> {/* Reusing table-container class */}
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container"> {/* Reusing table-container class */}
        <div className="no-results">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={col.key || index}>{col.label}</th>
            ))}
            {(onEdit || onDelete || onView) && <th>Actions</th>} {/* Only show Actions if any action is provided */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item[idKey]}>
              {columns.map((col, index) => (
                <td key={`${item[idKey]}-${col.key || index}`}>
                  {/* Use render function if provided, otherwise default to item[key] */}
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td>
                  <div className="action-buttons">
                    {onView && (
                      <button onClick={() => onView(item[idKey])} className="view-btn btn">
                        View
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(item[idKey])} className="edit-btn btn">
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item[idKey])} className="delete-btn btn">
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

GenericTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func, // Optional render function for custom cell content
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  idKey: PropTypes.string,
};

GenericTable.defaultProps = {
  isLoading: false,
  emptyMessage: 'No data available.',
};

export default GenericTable;
