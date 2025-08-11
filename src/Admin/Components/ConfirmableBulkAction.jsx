// ConfirmableBulkAction.jsx
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import BulkAction from './BulkAction'; // Import the pure button bar
import PropTypes from 'prop-types';
import './styles/BulkAction.css'; // Import custom styles

const ConfirmableBulkAction = ({
  selectedIds,
  isLoading,
  onClearSelection,
  handleBulkAction,
  handleExport
}) => {
  // Labels & button classes for each action
  const actionConfigs = {
    approve:   { label: 'Approve',             className: 'confirm-btn approve-btn' },
    reject:    { label: 'Reject',              className: 'confirm-btn reject-btn' },
    process:   { label: 'Mark as Processing',  className: 'confirm-btn process-btn' },
    complete:  { label: 'Mark as Completed',   className: 'confirm-btn complete-btn' }
  };

  // Generic confirmation handler
  const confirmBulkAction = (actionName) => {
    if (!selectedIds.length) return;

    const { label, className } = actionConfigs[actionName];

    confirmAlert({
      title: `Confirm ${label}`,
      message: `Are you sure you want to ${label.toLowerCase()} ${selectedIds.length} selected RMAs? This action cannot be undone.`,
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

  return (
    <BulkAction
      selectedCount={selectedIds.length}
      onApprove={() => confirmBulkAction('approve')}
      onReject={() => confirmBulkAction('reject')}
      onProcess={() => confirmBulkAction('process')}
      onClearSelection={onClearSelection}
      isProcessing={isLoading}
      availableActions={['approve', 'reject', 'process', 'complete', 'clear']} // show Complete too
      customActions={[
        {
          label: 'Mark as Completed',
          action: () => confirmBulkAction('complete'),
          className: 'complete-btn'
        },
        {
          label: `Export Selected (${selectedIds.length})`,
          action: () => handleExport(selectedIds),
          className: 'export-btn'
        }
      ]}
    />
  );
};

export default ConfirmableBulkAction;
