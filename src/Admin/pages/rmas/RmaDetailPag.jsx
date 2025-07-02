import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/rmadetails.css'; // optional styling

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const statusOptions = ['Pending', 'Approved', 'Rejected', 'Shipped', 'Completed'];

const RmaDetailPage = () => {
  const { id } = useParams(); // Get RMA ID from route
  const navigate = useNavigate();
  const [rma, setRma] = useState(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch single RMA
  useEffect(() => {
    const fetchRma = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/rmas/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        setRma(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.error(err);
        setError('Failed to load RMA details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRma();
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/rmas/${id}/status`, {
        status,
        note
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      alert('Status updated successfully!');
      navigate('/admin/rmas'); // Go back or reload page
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (isLoading) return <div className="loading">Loading RMA...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!rma) return <div>No RMA found.</div>;

  return (
    <div className="rma-detail-page">
      <h1>RMA Detail - #{rma.rmaNumber}</h1>

      <section className="info-section">
        <h2>Customer Info</h2>
        <p><strong>Name:</strong> {rma.customer.name}</p>
        <p><strong>Email:</strong> {rma.customer.email}</p>
        <p><strong>Phone:</strong> {rma.customer.phone}</p>
      </section>

      <section className="info-section">
        <h2>Product Info</h2>
        <p><strong>Model:</strong> {rma.product.model}</p>
        <p><strong>Serial Number:</strong> {rma.product.serialNumber}</p>
      </section>

      <section className="info-section">
        <h2>Return Details</h2>
        <p><strong>Reason:</strong> {rma.reason}</p>
        <p><strong>Description:</strong> {rma.description}</p>
      </section>

      <section className="info-section">
        <h2>Status Management</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="status-select">
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <textarea 
          placeholder="Optional admin note..." 
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          className="note-textarea"
        />
        <button onClick={handleStatusUpdate} className="update-btn">Update Status</button>
      </section>

      <button onClick={() => navigate('/admin/rmas')} className="back-btn">← Back to Dashboard</button>
    </div>
  );
};

export default RmaDetailPage;
