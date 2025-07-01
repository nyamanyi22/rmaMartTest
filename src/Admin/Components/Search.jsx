import { useState } from 'react';
import RmaTable from './RmaTable';

export default function RmaSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  return (
    <div className="rma-search">
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by RMA number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      
      <RmaTable searchTerm={searchTerm} statusFilter={filterStatus} />
    </div>
  );
}