import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // ✅ Fix: useLocation
import axiosAdmin from '../api/axiosAdmin';
import './styles/UserList.css';

const AdminList = () => {
  const location = useLocation();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || ''); // ✅ works now
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editAdmin, setEditAdmin] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: ''
  });
  const [selectedAdmins, setSelectedAdmins] = useState([]); // ✅ for bulk selection
  const [bulkRole, setBulkRole] = useState('');

  // ✅ Fetch admins on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // ✅ Auto-clear success message after 3s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchAdmins = async () => {
    try {
      const res = await axiosAdmin.get('/admins');
      setAdmins(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('Failed to load admin users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

 const handleDelete = async (id) => {
    try {
      await axiosAdmin.delete(`/admins/${id}`);
      setAdmins(admins.filter(admin => admin.id !== id));
      setDeleteConfirm(null);
+     setMessage("Admin deleted successfully ✅");
    } catch (err) {
      console.error('Failed to delete admin:', err);
      setError('Failed to delete admin. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axiosAdmin.post(`/admins/bulk-delete`, { ids: selectedAdmins });
      setAdmins(admins.filter(admin => !selectedAdmins.includes(admin.id)));
      setSelectedAdmins([]);
    } catch (err) {
      console.error('Failed bulk delete:', err);
      setError('Failed to delete selected admins.');
    }
  };

  const handleBulkRoleUpdate = async () => {
    if (!bulkRole) return;
    try {
      await axiosAdmin.post(`/admins/bulk-update-role`, {
        ids: selectedAdmins,
        role: bulkRole
      });
      setAdmins(admins.map(admin =>
        selectedAdmins.includes(admin.id) ? { ...admin, role: bulkRole } : admin
      ));
      setSelectedAdmins([]);
      setBulkRole('');
    } catch (err) {
      console.error('Failed bulk role update:', err);
      setError('Failed to update roles for selected admins.');
    }
  };

  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setEditForm({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      role: admin.role
    });
  };

const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosAdmin.put(`/admins/${editAdmin.id}`, editForm);
      setAdmins(admins.map(admin =>
        admin.id === editAdmin.id ? { ...admin, ...editForm } : admin
      ));
      setEditAdmin(null);
+     setMessage("Admin updated successfully ✅");
    } catch (err) {
      console.error('Failed to update admin:', err);
      setError('Failed to update admin. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (id) => {
    setSelectedAdmins(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAdmins(filteredAdmins.map(admin => admin.id));
    } else {
      setSelectedAdmins([]);
    }
  };

  const sortedAdmins = React.useMemo(() => {
    if (!sortConfig.key) return admins;
    return [...admins].sort((a, b) => {
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [admins, sortConfig]);

  const filteredAdmins = sortedAdmins.filter(admin => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.first_name.toLowerCase().includes(searchLower) ||
      admin.last_name.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      admin.role.toLowerCase().includes(searchLower)
    );
  });

  const formatRole = (role) => role.replace('_', ' ').toUpperCase();

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="admin-list-container">
      {message && <div className="toast-message success">{message}</div>}

      <div className="admin-list-header">
        <h2>Admin Users</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* ✅ Bulk action bar */}
      {selectedAdmins.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedAdmins.length} selected</span>
          <button onClick={handleBulkDelete} className="delete-btn">Bulk Delete</button>
          <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)}>
            <option value="">Change Role...</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
            <option value="support">Support</option>
          </select>
          <button onClick={handleBulkRoleUpdate} className="save-btn">Apply Role</button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredAdmins.length === 0 ? (
        <div className="no-results">
          {searchTerm ? 'No matching admins found' : 'No admin users found'}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedAdmins.length === filteredAdmins.length && filteredAdmins.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('id')}>
                  #<SortIndicator columnKey="id" />
                </th>
                <th onClick={() => handleSort('first_name')}>
                  Full Name<SortIndicator columnKey="first_name" />
                </th>
                <th onClick={() => handleSort('email')}>
                  Email<SortIndicator columnKey="email" />
                </th>
                <th onClick={() => handleSort('role')}>
                  Role<SortIndicator columnKey="role" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, index) => (
                <tr key={admin.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAdmins.includes(admin.id)}
                      onChange={() => handleSelect(admin.id)}
                    />
                  </td>
                  <td data-label="#">{index + 1}</td>
                  <td data-label="Full Name">
                    {admin.first_name} {admin.last_name}
                  </td>
                  <td data-label="Email">{admin.email}</td>
                  <td data-label="Role">{formatRole(admin.role)}</td>
                  <td data-label="Actions" className="actions-cell">
                    <button onClick={() => handleEdit(admin)} className="edit-btn">Edit</button>
                    <button onClick={() => setDeleteConfirm(admin.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this admin?</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)} className="cancel-btn">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="confirm-delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {editAdmin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Admin</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editForm.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editForm.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="csr">CSR</option>
                  <option value="viewonly">View Only</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setEditAdmin(null)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
