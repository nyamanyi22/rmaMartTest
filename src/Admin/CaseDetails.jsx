import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CaseStatus.css';

const CaseStatus = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const casesPerPage = 10;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/rma', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setCases(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const processedCases = cases
    .filter(caseItem => 
      (statusFilter === 'All' || (caseItem.status || 'Pending') === statusFilter) &&
      (caseItem.id.toString().includes(searchTerm.toLowerCase()) ||
       caseItem.customer_id.toString().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = processedCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(processedCases.length / casesPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'Closed': return 'status-closed';
      case 'Pending': return 'status-pending';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="case-status-container">
      <h1>RMA Case Status</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by case ID or customer ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <table className="cases-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('id')}>RMA ID</th>
            <th onClick={() => requestSort('customer_id')}>Customer ID</th>
            <th>Status</th>
            <th onClick={() => requestSort('created_at')}>Date Submitted</th>
            <th onClick={() => requestSort('updated_at')}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {currentCases.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.customer_id}</td>
              <td>
                <span className={`status-badge ${getStatusColor(item.status || 'Pending')}`}>
                  {item.status || 'Pending'}
                </span>
              </td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>{new Date(item.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages).keys()].map(num => (
          <button
            key={num + 1}
            onClick={() => setCurrentPage(num + 1)}
            className={currentPage === (num + 1) ? 'active' : ''}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CaseStatus;
