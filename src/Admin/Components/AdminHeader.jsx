import React, { useState } from 'react';
import { useAdminAuth } from '../AdminContex/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import './styles/adminHeader.css';
import logo from '../../assets/martLogo.png';

const AdminHeader = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // 🔀 Hamburger toggle

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <img src={logo} alt="MARTR Logo" className="admin-logo" />
        <h1 className="admin-title">MART NETWORKS RMA Portal</h1>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`admin-header-right ${menuOpen ? 'open' : ''}`}>
        {admin && (
          <span className="admin-welcome">
            Welcome, <strong>{admin.first_name}</strong>
          </span>
        )}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
