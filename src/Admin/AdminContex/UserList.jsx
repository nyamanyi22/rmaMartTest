import React, { useEffect, useState } from 'react';
import axiosAdmin from '../api/axiosAdmin'; // Adjust if path is different
import './styles/UserList.css'; // Optional CSS file

const AdminList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
   const res = await axiosAdmin.get('/admins'); // resolves to /api/admin/admins
; // GET /api/admin/users
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h2>Admin Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && !error && users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
  {users.map((user, index) => (
    <tr key={user.id}>
      <td data-label="#"> {index + 1} </td>
      <td data-label="Full Name"> {user.first_name} {user.last_name} </td>
      <td data-label="Email"> {user.email} </td>
      <td data-label="Role"> {user.role.replace('_', ' ').toUpperCase()} </td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

export default AdminList;
