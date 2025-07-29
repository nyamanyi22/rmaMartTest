// src/admin/pages/CustomerList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAxios from '../../api/axiosAdmin';
import './styles/CustomerList.css';

const exportToCSV = (customers) => {
  if (!customers.length) return;

  const headers = ['Company Name', 'First Name', 'Last Name', 'Email', 'Phone'];
  const rows = customers.map(c => [
    c.company_name || 'N/A',
    c.first_name,
    c.last_name,
    c.email,
    c.phone || 'N/A',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `customers_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportMode, setExportMode] = useState('filtered');
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await adminAxios.get('/customers');
        setCustomers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customers.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    [c.first_name, c.last_name, c.email, c.company_name].join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  const handleEdit = (id) => navigate(`/admin/customers/edit/${id}`);
  const handleCreate = () => navigate('/admin/customers/create');

  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`/customers/${id}`);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete customer.');
    }
  };

  const handleExport = async () => {
    let exportData = [];

    if (exportMode === 'all') {
      try {
        const response = await adminAxios.get('/customers');
        exportData = response.data;
      } catch (error) {
        console.error('Export failed:', error);
        setError('Export failed.');
        return;
      }
    } else {
      exportData = filteredCustomers;
    }

    exportToCSV(exportData);
  };

  return (
    <div className="customer-list p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customer List</h2>
        <div className="flex gap-2">
          <button onClick={handleCreate} className="btn btn-primary">+ New</button>
          <select
            value={exportMode}
            onChange={(e) => setExportMode(e.target.value)}
            className="btn btn-light border"
          >
            <option value="filtered">Export Filtered</option>
            <option value="all">Export All</option>
          </select>
          <button onClick={handleExport} className="btn btn-secondary">Export CSV</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search customers..."
        className="input-search mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>First</th>
                <th>Last</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((c) => (
                <tr key={c.id}>
                  <td>{c.company_name || 'N/A'}</td>
                  <td>{c.first_name}</td>
                  <td>{c.last_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '-'}</td>
                  <td className="flex gap-2">
                    <button onClick={() => handleEdit(c.id)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${i + 1 === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
