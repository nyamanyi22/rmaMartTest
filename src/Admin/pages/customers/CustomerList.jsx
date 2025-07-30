// src/admin/pages/CustomerList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers, deleteCustomer } from '../../api/CustomerService';
import MessageModal from '../../Components/MessageModal';
import './styles/CustomerList.css';

const exportToCSV = (customers) => {
    if (!customers.length) return;

    const headers = ['Account No', 'Company Name', 'First Name', 'Last Name', 'Email', 'Phone', 'Fax', 'Shipping Country', 'Shipping State', 'Shipping Address 1', 'Shipping Address 2', 'Shipping City', 'Shipping Zipcode', 'Is Billing Address Different', 'Billing Country', 'Billing State', 'Billing Address 1', 'Billing Address 2', 'Billing City', 'Billing Zipcode', 'Verification Key'];
    const rows = customers.map(c => [
        c.account_no || '',
        c.company_name || 'N/A',
        c.first_name,
        c.last_name,
        c.email,
        c.phone || 'N/A',
        c.fax || 'N/A',
        c.shipping_country || '',
        c.shipping_state || '',
        c.shipping_address1 || '',
        c.shipping_address2 || '',
        c.shipping_city || '',
        c.shipping_zipcode || '',
        c.is_billing_address_different ? 'Yes' : 'No',
        c.billing_country || '',
        c.billing_state || '',
        c.billing_address1 || '',
        c.billing_address2 || '',
        c.billing_city || '',
        c.billing_zipcode || '',
        c.verification_key || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')),
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
    const [modal, setModal] = useState(null);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    const getCustomers = useCallback(async (page = 1, search = '') => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchCustomers({ page, perPage: itemsPerPage, search });
            console.log('Customer API Response:', response);
            setCustomers(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError(err.response?.data?.message || 'Failed to fetch customers.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getCustomers(currentPage, searchQuery);
    }, [currentPage, searchQuery, getCustomers]);

    const filteredCustomers = Array.isArray(customers) ? customers.filter((c) =>
        [c.first_name, c.last_name, c.email, c.company_name, c.account_no].join(' ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    ) : [];

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
        setModal({
            message: 'Are you sure you want to delete this customer? This action cannot be undone.',
            type: 'confirm',
            onConfirm: async () => {
                setModal(null);
                setIsLoading(true);
                try {
                    await deleteCustomer(id);
                    setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== id));
                    setModal({ message: 'Customer deleted successfully.', type: 'success' });
                    getCustomers(currentPage, searchQuery);
                } catch (err) {
                    console.error('Delete failed:', err);
                    setModal({ message: err.response?.data?.message || 'Failed to delete customer.', type: 'error' });
                } finally {
                    setIsLoading(false);
                }
            },
            onCancel: () => setModal(null)
        });
    };

    const handleExport = async () => {
        let exportData = [];

        if (exportMode === 'all') {
            try {
                const response = await fetchCustomers({ page: 1, perPage: 999999 });
                exportData = Array.isArray(response.data) ? response.data : [];
            } catch (err) {
                console.error('Export failed:', err);
                setModal({ message: err.response?.data?.message || 'Export failed.', type: 'error' });
                return;
            }
        } else {
            exportData = filteredCustomers;
        }

        exportToCSV(exportData);
        setModal({ message: 'Customers exported to CSV successfully!', type: 'success' });
    };

    const closeModal = () => setModal(null);

    return (
        <div className="customer-list-container">
            <div className="header-section">
                <h2 className="page-title">Customer List</h2>
                <div className="button-group">
                    <button onClick={handleCreate} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Customer
                    </button>
                    <select value={exportMode} onChange={(e) => setExportMode(e.target.value)} className="btn-light select-export">
                        <option value="filtered">Export Filtered</option>
                        <option value="all">Export All</option>
                    </select>
                    <button onClick={handleExport} className="btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>

            <input
                type="text"
                placeholder="Search customers by name, email, company, or account no..."
                className="input-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {error && <div className="error-message">{error}</div>}
            {isLoading ? (
                <div className="loading-message">Loading customers...</div>
            ) : (
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr><th>Account No</th><th>Company</th><th>First</th><th>Last</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {currentItems.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.account_no || '-'}</td>
                                    <td>{c.company_name || 'N/A'}</td>
                                    <td>{c.first_name}</td>
                                    <td>{c.last_name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || '-'}</td>
                                    <td className="action-buttons">
                                        <button onClick={() => handleEdit(c.id)} className="btn-edit">Edit</button>
                                        <button onClick={() => handleDelete(c.id)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="no-customers-found">No customers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination-container">
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

            {modal && (
                <MessageModal
                    message={modal.message}
                    type={modal.type}
                    onClose={modal.onCancel || modal.onConfirm ? undefined : closeModal}
                    onConfirm={modal.onConfirm}
                    onCancel={modal.onCancel}
                />
            )}
        </div>
    );
};

export default CustomerList;
