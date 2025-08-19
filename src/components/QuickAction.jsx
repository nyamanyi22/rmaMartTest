import React from 'react';
import { FaSearch, FaUserEdit, FaPlusCircle, FaFileDownload } from 'react-icons/fa';

const QuickActions = () => {
  const actions = [
    { icon: <FaSearch />, title: 'Check RMA Case Status', link: '/RmaStatus' },
    { icon: <FaUserEdit />, title: 'Review Account Profile', link: '/account' },
    { icon: <FaPlusCircle />, title: 'Submit New RMA Request', link: '/PreRequest' },
    { icon: <FaFileDownload />, title: 'Product Return Policy', link: '/ReturnPolicy' },
    
  ];

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>
      <div className="action-grid">
        {actions.map((action, index) => (
          <div key={index} className="action-card" onClick={() => window.location.href = action.link}>
            {action.icon}
            <h3>{action.title}</h3>
          </div>
        ))}
   

      </div>
    </div>
  );
};

export default QuickActions;