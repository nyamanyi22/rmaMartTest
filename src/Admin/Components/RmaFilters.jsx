import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RmaFilters.css';

const RmaFilters = ({ 
  filters, 
  onFilterChange, 
  onReset,
  onSavePreset 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [presetName, setPresetName] = useState('');
  const [showPresetModal, setShowPresetModal] = useState(false);

  // Sync local state with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(localFilters);
    }, 300);
    return () => clearTimeout(timer);
  }, [localFilters, onFilterChange]);

  const handleChange = (name, value) => {
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [name]: date }
    }));
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' }
  ];

  const returnReasons = [
    'Defective',
    'Wrong Item',
    'No Longer Needed',
    'Customer Changed Mind'
  ];

  const saveCurrentPreset = () => {
    if (presetName.trim()) {
      onSavePreset({
        name: presetName,
        filters: localFilters
      });
      setPresetName('');
      setShowPresetModal(false);
    }
  };

  return (
    <div className="filters-container">
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="RMA #, customer, product..."
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            aria-label="Search RMAs"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            aria-label="Filter by status"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="returnReason">Return Reason</label>
          <select
            id="returnReason"
            value={localFilters.returnReason || ''}
            onChange={(e) => handleChange('returnReason', e.target.value || null)}
            aria-label="Filter by return reason"
          >
            <option value="">All Reasons</option>
            {returnReasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group date-filter-group">
          <label>Date Range</label>
          <div className="date-pickers">
            <DatePicker
              selected={localFilters.dateRange.start}
              onChange={(date) => handleDateChange('start', date)}
              selectsStart
              startDate={localFilters.dateRange.start}
              endDate={localFilters.dateRange.end}
              placeholderText="Start date"
              className="date-input"
              maxDate={new Date()}
            />
            <span className="date-separator">to</span>
            <DatePicker
              selected={localFilters.dateRange.end}
              onChange={(date) => handleDateChange('end', date)}
              selectsEnd
              startDate={localFilters.dateRange.start}
              endDate={localFilters.dateRange.end}
              minDate={localFilters.dateRange.start}
              placeholderText="End date"
              className="date-input"
              maxDate={new Date()}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button
            type="button"
            onClick={() => setShowPresetModal(true)}
            className="preset-btn"
          >
            Save Preset
          </button>
          <button
            type="button"
            onClick={onReset}
            className="reset-btn"
            disabled={
              !localFilters.search &&
              localFilters.status === 'all' &&
              !localFilters.dateRange.start &&
              !localFilters.dateRange.end &&
              !localFilters.returnReason
            }
            aria-label="Reset filters"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {showPresetModal && (
        <div className="preset-modal">
          <div className="modal-content">
            <h3>Save Filter Preset</h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name"
              className="preset-input"
            />
            <div className="modal-actions">
              <button onClick={() => setShowPresetModal(false)}>Cancel</button>
              <button 
                onClick={saveCurrentPreset}
                disabled={!presetName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

RmaFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    dateRange: PropTypes.shape({
      start: PropTypes.instanceOf(Date),
      end: PropTypes.instanceOf(Date)
    }),
    returnReason: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSavePreset: PropTypes.func
};

export default RmaFilters;