import { useState, useEffect } from 'react';
import RmaSearch from '../Components/Search';

const ManageCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [returnReason, setReturnReason] = useState('');

  return (
    <div className="manage-cases">
      <h1>Manage Cases</h1>
      <RmaSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
      />
    </div>
  );
}
export default ManageCases;