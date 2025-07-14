import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import './styles/adminHeader.css';
import logo from '../../assets/martLogo.png';
import { useAdminAuth } from '../AdminContex/AdminAuthContext';

const AdminHeader = ({ isSidebarOpen, toggleSidebar, pageTitle }) => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth(); // ✅ Get admin state and logout

  const handleAuthClick = () => {
    if (admin) {
      logout(); // Call logout function from context
      navigate('/admin/login');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <header className="rma-header" role="banner">
      <div className="header-left">
        <button
          className="sidebar-toggle-button"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
        </button>

        <div className="logo-container">
          <img src={logo} alt="Mart Network Solutions Logo" className="company-logo" />
        </div>

        <h1 className="rma-title">
          <span className="rma-icon" aria-hidden="true">📦</span>
          {pageTitle} <span className="version">v2.1.0</span>
        </h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          {admin && (
            <div className="user-greeting">
              <span className="welcome-text">Welcome, </span>
              <span className="user-name">{admin.first_name || 'Admin'}</span>
            </div>
          )}
          <button
            className="logout-btn"
            onClick={handleAuthClick}
            aria-label={admin ? "Log out of admin panel" : "Log in to admin panel"}
          >
            <span className="logout-icon" aria-hidden="true">⎋</span>
            {admin ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </header>
  );
};

AdminHeader.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
};

export default AdminHeader;
