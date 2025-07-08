import React from 'react';
import PropTypes from 'prop-types';
import './styles/adminHeader.css';
import logo from '../../assets/martLogo.png';

const Header = ({ userName = 'Admin', onLogout }) => {
  const handleLogout = () => {
    // Call the passed logout handler if it exists
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    } else {
      console.log("Logging out...");
      // Default behavior if no handler provided
    }
  };

  return (
    <header className="rma-header" role="banner">
      <div className="header-left">
        <div className="logo-container">
          <img 
            src={logo} 
            alt="Mart Network Solutions Logo" 
            className="company-logo"
          />
        </div>
        <h1 className="rma-title">
          <span className="rma-icon" aria-hidden="true">📦</span>
          RMA Admin Panel <span className="version">v2.1.0</span>
        </h1>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <div className="user-greeting">
            <span className="welcome-text">Welcome, </span>
            <span className="user-name">{userName}</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            aria-label="Log out of admin panel"
          >
            <span className="logout-icon" aria-hidden="true">⎋</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  userName: PropTypes.string,
  onLogout: PropTypes.func
};

export default Header;