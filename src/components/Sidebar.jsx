import React from 'react';
import { FaTachometerAlt, FaExchangeAlt, FaHistory, FaUserCog, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css'; // ✅ Import your CSS file for styling
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate(); // ✅ Get navigate function

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, tab: 'dashboard', route: '/' },
    { name: 'RMA Requests', icon: <FaExchangeAlt />, tab: 'requests', route:'/PreRequest' },
    { name: 'Case Status', icon: <FaHistory />, tab: 'status' },
    { name: 'Account', icon: <FaUserCog />, tab: 'account' },
    { name: 'Policies', icon: <FaFileAlt />, tab: 'policies', route: '/ReturnPolicy' }
  ];


  const handleClick = (item) => {
    setActiveTab(item.tab);
    if (item.route) {
      navigate(item.route); // Navigate to the route if defined
    }
  };

  return (
    <div className="sidebar">
      <h3>Navigation</h3>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.tab}
            className={activeTab === item.tab ? 'active' : ''}
            onClick={() => handleClick(item)} 
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
