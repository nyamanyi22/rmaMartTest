import PropTypes from 'prop-types';
import { useEffect } from 'react';
import './styles/BulkAction.css';

const BulkAction = ({
  selectedCount,
  onApprove,
  onReject,
  onProcess,
  onClearSelection,
  isProcessing = false,
  availableActions = ['approve', 'reject', 'process', 'clear'],
  customActions = []
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedCount > 0 && e.key === 'Escape') {
        onClearSelection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCount, onClearSelection]);

  if (selectedCount === 0) return null;

  return (
    <div className="bulk-action-bar" role="toolbar">
      <span className="selection-count">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <div className="bulk-buttons">
        {availableActions.includes('approve') && (
          <button
            className="approve-btn"
            onClick={onApprove}
            disabled={isProcessing}
            aria-label="Approve selected items"
          >
            Approve
          </button>
        )}
        
        {availableActions.includes('reject') && (
          <button
            className="reject-btn"
            onClick={onReject}
            disabled={isProcessing}
            aria-label="Reject selected items"
          >
            Reject
          </button>
        )}
        
        {availableActions.includes('process') && (
          <button
            className="process-btn"
            onClick={onProcess}
            disabled={isProcessing}
            aria-label="Mark selected items as processing"
          >
            Processing
          </button>
        )}
        
        {customActions.map((action, i) => (
          <button
            key={`custom-${i}`}
            className={`action-btn ${action.className || ''}`}
            onClick={action.action}
            disabled={isProcessing}
          >
            {action.label}
          </button>
        ))}
        
        {availableActions.includes('clear') && (
          <button
            className="clear-btn"
            onClick={onClearSelection}
            aria-label="Clear selection"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

BulkAction.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onProcess: PropTypes.func,
  onClearSelection: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
  availableActions: PropTypes.arrayOf(
    PropTypes.oneOf(['approve', 'reject', 'process', 'clear'])
  ),
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
      className: PropTypes.string
    })
  )
};

export default BulkAction;