import RmaTable from '../components/RmaTable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RmaDashboardPage.css';

const RmaDashboardPage = () => {
  const [selectedRmas, setSelectedRmas] = useState([]);
  const [rmas, setRmas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRmas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/rmas');
        const data = await response.json();
        setRmas(data);
      } catch (error) {
        console.error('Failed to fetch RMAs', error);
      }
    };
    fetchRmas();
  }, []);

  return (
    <div className="rma-dashboard">
      <div className="dashboard-controls">
        <h2>RMA Management</h2>
        <div className="controls-right">
          <button 
            className="btn-primary"
            onClick={() => navigate('/admin/rmas/create')}
          >
            Create New RMA
          </button>
        </div>
      </div>
      
      <RmaTable 
        data={rmas}
        selectedItems={selectedRmas}
        onSelectItems={setSelectedRmas}
        onViewItem={(rma) => navigate(`/admin/rmas/${rma.id}`)}
      />
    </div>
  );
};

export default RmaDashboardPage;
