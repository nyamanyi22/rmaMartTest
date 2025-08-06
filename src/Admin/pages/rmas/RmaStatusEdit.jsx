import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRmaById, updateRma, fetchStatusOptions } from '../../api/rmaService'; // Import service functions
import './styles/RmaStatusEdit.css'; // Assuming you have this CSS file for styling

const RmaStatusEdit = () => {
  const { id } = useParams(); // RMA ID from route
  const navigate = useNavigate(); // Hook for navigation

  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]); // State for fetched status options
  const [error, setError] = useState(null); // State for general errors
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  // Load the current RMA details and status options
  useEffect(() => {
    const loadRmaData = async () => {
      setLoading(true);
      setError(null);
      setSuccessMessage(''); // Clear messages on load

      try {
        // Fetch current RMA details
        const rmaResponse = await fetchRmaById(id);
        // Backend returns RMA directly, not res.data.rma
        setStatus(rmaResponse.status || '');
        setNotes(rmaResponse.notes || '');

        // Fetch status options
        const statusOptionsResponse = await fetchStatusOptions();
        setStatuses(statusOptionsResponse);

      } catch (err) {
        console.error('Failed to load RMA data:', err);
        setError('Failed to load RMA details or status options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRmaData();
  }, [id]); // Re-run when RMA ID changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Use the updateRma service function
      await updateRma(id, { status, notes });

      setSuccessMessage('RMA updated successfully!');
      // Optionally, navigate back after a short delay
      setTimeout(() => {
        navigate('/admin/rmas');
      }, 1500); // Give user time to see success message
      
    } catch (err) {
      console.error('Failed to update RMA:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Handle Laravel validation errors
        const validationErrors = Object.values(err.response.data.errors).flat().join(' ');
        setError(`Validation Error: ${validationErrors}`);
      } else if (err.response && err.response.data && err.response.data.message) {
        // Handle general error message from backend
        setError(`Error: ${err.response.data.message}`);
      } else {
        // Fallback for network or other errors
        setError('Failed to update RMA. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-message">Loading RMA details...</p>;
  if (error) return <p className="error-message-standalone">{error}</p>;

  return (
    <div className="rma-edit-container">
      <h2 className="rma-edit-title">Update RMA Details</h2>

      <form onSubmit={handleSubmit} className="rma-edit-form">
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- Select Status --</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Admin Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-textarea"
            rows={4}
          />
        </div>

        {successMessage && (
          <p className="message-box success-message-standalone">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="message-box error-message-standalone">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate('/admin/rmas')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update RMA'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RmaStatusEdit;
