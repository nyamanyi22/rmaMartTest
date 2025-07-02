import React from 'react';
import './styles/admin/Header.css';
import logo from '../../../assets/martLogo.png';

export default function Header() {
  const handleLogout = () => {
    // TODO: Connect this with auth logout logic
    console.log("Logging out...");
  };

  return (
    <header className="rma-header">
      <div className="header-left">
        <h1 className="rma-logo">📦 RMA Admin Panel</h1>
      </div>
      <div className="header-right">
        <div className="user-info">
          <img src={logo} alt="Admin Logo" />
          <span className="user-name">Welcome, Admin</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
