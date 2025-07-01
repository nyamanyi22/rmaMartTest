import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientRmaStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/my-rma-requests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setRequests(response.data);
      } catch (err) {
        setError('Failed to load your RMA requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div>Loading your RMA requests...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (requests.length === 0) return <div>You have no RMA requests yet.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your RMA Requests</h2>
      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Product: {req.product_code}
              </h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {req.status || 'Pending'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Serial Number: {req.serial_number}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Return Reason: {req.return_reason}
            </p>
            <p className="text-sm text-gray-600">
              Submitted On: {new Date(req.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientRmaStatus;
