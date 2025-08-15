import React, { useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import PropTypes from 'prop-types';
import './styles/BulkAction.css';

const ConfirmableBulkAction = ({
  selectedIds,
   allData,
  isLoading,
  onClearSelection,
  handleBulkAction,
  handleExport
}) => {
  const selectedCount = selectedIds.length;

  // Labels & button classes for each action
  const actionConfigs = {
    approve:   { label: 'Approve',             className: 'approve-btn' },
    reject:    { label: 'Reject',              className: 'reject-btn' },
    process:   { label: 'Processing',          className: 'process-btn' },
    complete:  { label: 'Complete',            className: 'complete-btn' }
  };

  // Escape key handler for clearing selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedCount > 0 && e.key === 'Escape') {
        onClearSelection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCount, onClearSelection]);

  // Confirmation wrapper
  const confirmBulkAction = (actionName) => {
    if (!selectedCount) return;
    const { label, className } = actionConfigs[actionName];

    confirmAlert({
      title: `Confirm ${label}`,
      message: `Are you sure you want to ${label.toLowerCase()} ${selectedCount} selected RMAs? This action cannot be undone.`,
      buttons: [
        {
          label: `Yes, ${label}`,
          onClick: () => handleBulkAction(actionName),
          className
        },
        { label: 'Cancel' }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true
    });
  };

// hide toolbar if no selection

  return (
    <div className="bulk-action-bar" role="toolbar">
      <span className="selection-count">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>

      <div className="bulk-buttons">
        {/* Approve */}
        <button
          className="approve-btn"
          onClick={() => confirmBulkAction('approve')}
           disabled={isLoading || selectedCount === 0} 
        >
          Approve
        </button>

        {/* Reject */}
        <button
          className="reject-btn"
          onClick={() => confirmBulkAction('reject')}
        disabled={isLoading || selectedCount === 0} 
        >
          Reject
        </button>

        {/* Processing */}
        <button
          className="process-btn"
          onClick={() => confirmBulkAction('process')}
   disabled={isLoading || selectedCount === 0} 
        >
          Processing
        </button>

        {/* Complete */}
        <button
          className="complete-btn"
          onClick={() => confirmBulkAction('complete')}
         disabled={isLoading || selectedCount === 0} 
        >
          Complete
        </button>

        {/* Export */}
      {/* Export */}
<button
  className="export-btn"
  onClick={() => {
    if (selectedCount > 0) {
      handleExport(selectedIds); // Export selected
    } else {
      if (!allData || allData.length === 0) {
        alert('No data available to export.');
        return;
      }
      handleExport([]); // Special case: export all
    }
  }}
  disabled={isLoading}
>
  {selectedCount > 0
    ? `Export Selected (${selectedCount})`
    : 'Export All'}
</button>


        {/* Clear */}
        <button
          className="clear-btn"
          onClick={onClearSelection}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

ConfirmableBulkAction.propTypes = {
  selectedIds: PropTypes.array.isRequired,
  allData: PropTypes.array, // Optional prop for exporting all data
  isLoading: PropTypes.bool,
  onClearSelection: PropTypes.func.isRequired,
  handleBulkAction: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired
};

export default ConfirmableBulkAction;
