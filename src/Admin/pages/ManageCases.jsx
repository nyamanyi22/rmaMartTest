import { useState, useEffect } from 'react';
import RmaTable  from './RmaTable';
import './RmaSearch.css';

export default function RmaSearch() {
  const [allRmas, setAllRmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedRmas, setSelectedRmas] = useState([]);
  const [filterPresets, setFilterPresets] = useState([]);
  const [presetName, setPresetName] = useState('');

  // Fetch data and initialize
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/rmas');
        const data = await response.json();
        setAllRmas(data);
        
        const savedPresets = localStorage.getItem('rmaFilterPresets');
        if (savedPresets) setFilterPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter data
  const filteredRmas = allRmas.filter(rma => {
    const matchesSearch = debouncedSearchTerm === '' ||
      rma.rma_number.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      rma.customer_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || rma.status === filterStatus;
    
    const matchesDate = (!dateRange.start || new Date(rma.created_at) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(rma.created_at) <= new Date(dateRange.end));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Preset management
  const savePreset = () => {
    const newPreset = {
      name: presetName,
      filters: { searchTerm, filterStatus, dateRange }
    };
    const updatedPresets = [...filterPresets, newPreset];
    setFilterPresets(updatedPresets);
    localStorage.setItem('rmaFilterPresets', JSON.stringify(updatedPresets));
    setPresetName('');
  };

  const loadPreset = (preset) => {
    setSearchTerm(preset.filters.searchTerm);
    setFilterStatus(preset.filters.filterStatus);
    setDateRange(preset.filters.dateRange);
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedRmas.length === 0) return;
    // Implement bulk actions here
  };

  return (
    <div className="rma-search-container">
      <div className="search-header">
        <h2>RMA Management</h2>
        <div className="header-actions">
          <button className="primary-button">
            + Create New RMA
          </button>
        </div>
      </div>

      <div className="search-controls">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search RMAs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {['All', 'Pending', 'Approved', 'Rejected', 'Completed'].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          />
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          />
        </div>
        
        <button onClick={() => savePreset()} disabled={!presetName}>
          Save Preset
        </button>
      </div>

      {selectedRmas.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedRmas.length} selected</span>
          <button onClick={() => handleBulkAction('approve')}>Approve</button>
          <button onClick={() => handleBulkAction('reject')}>Reject</button>
          <button onClick={() => handleBulkAction('export')}>Export</button>
        </div>
      )}

      <RmaTable
        data={filteredRmas}
        selectedItems={selectedRmas}
        onSelectItems={setSelectedRmas}
        isLoading={loading}
      />
    </div>
  );
}