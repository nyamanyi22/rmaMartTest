import React from 'react';
import PropTypes from 'prop-types';
import './styles/StatusBadge.css'; // Optional CSS styling

const StatusBadge = ({ status }) => {
  const colorMap = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    shipped: 'badge-shipped',
    completed: 'badge-completed',
    processing: 'badge-processing',
    awaiting_parts: 'badge-awaiting-parts'
  };

  const statusLabel = status.replace(/_/g, ' ').toUpperCase();

  return (
    <span className={`status-badge ${colorMap[status] || 'badge-default'}`}>
      {statusLabel}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusBadge;
