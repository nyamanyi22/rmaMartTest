import React from 'react';
import PropTypes from 'prop-types';

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
  const bgColor = type === 'success' ? 'bg-green-100' : (type === 'error' ? 'bg-red-100' : 'bg-blue-100');
  const textColor = type === 'success' ? 'text-green-800' : (type === 'error' ? 'text-red-800' : 'text-blue-800');
  const borderColor = type === 'success' ? 'border-green-400' : (type === 'error' ? 'border-red-400' : 'border-blue-400');
  const buttonColor = type === 'confirm' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`relative p-6 rounded-lg shadow-xl max-w-sm w-full ${bgColor} border ${borderColor}`}>
        <p className={`text-center font-semibold ${textColor}`}>{message}</p>

        {type === 'confirm' ? (
          <div className="flex justify-around mt-4 gap-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`mt-4 w-full text-white p-2 rounded-md transition ${buttonColor}`}
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
