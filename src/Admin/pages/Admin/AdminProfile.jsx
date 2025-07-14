import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminProfile.css'; // You'll create this file next

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('adminToken');

        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdmin(response.data);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) return <div className="loading">⏳ Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Admin Profile</h1>

      <div className="profile-info">
        <p><strong>Name:</strong> {admin.first_name} {admin.last_name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Role:</strong> {admin.role}</p>
        <p><strong>ID:</strong> {admin.id}</p>
      </div>
    </div>
  );
};

export default AdminProfile;
