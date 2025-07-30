import React from 'react';
import PropTypes from 'prop-types';
import './styles/Modal.css'; // Import the CSS file

/**
 * Reusable Message Modal Component.
 * Displays a message with a type (success/error) and an optional confirmation button.
 *
 * @param {object} props
 * @param {string} props.message - The message to display.
 * @param {'success' | 'error' | 'confirm'} props.type - Type of message for styling and behavior.
 * @param {function} props.onClose - Function to call when the modal should close (e.g., on 'Close' button click).
 * @param {function} [props.onConfirm] - Optional function to call for 'confirm' type modals when confirmed.
 */
const MessageModal = ({ message, type, onClose, onConfirm }) => {
  // Determine class names based on type
  const modalTypeClass = `modal-type-${type}`;
  const buttonTypeClass = `btn-type-${type}`;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${modalTypeClass}`}>
        <p className="modal-message">{message}</p>

        {type === 'confirm' ? (
          <div className="modal-actions-confirm">
            <button
              onClick={onConfirm}
              className="modal-button modal-button-confirm"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="modal-button modal-button-cancel"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`modal-button ${buttonTypeClass}`}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

MessageModal.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'confirm']).isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func, // Optional for 'confirm' type
};

export default MessageModal;
