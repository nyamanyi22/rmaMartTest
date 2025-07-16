import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaUserCircle} from 'react-icons/fa';
import logo from '../../assets/martLogo.png';
import './styles.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && menuOpen) {
        setMenuOpen(false);
      }
    };
     window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);
const { user, logout } = useAuth();
const isAuthenticated = !!user;
 
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={logo} alt="Mart Networks Logo" className="logo-img" />
          <span className="rma-title"> RMA System</span>
        </div>

        <nav className="desktop-nav">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <div className="nav-item">
            <span className="nav-link">Quick Links <FaChevronDown className="dropdown-icon" /></span>
            <div className="dropdown-menu">
              <NavLink to="/PreRequest" className="dropdown-item">RMA Requests</NavLink>
              <NavLink to="/CaseStatus" className="dropdown-item">Case Status</NavLink>
              <NavLink to="/ReturnPolicy" className="dropdown-item">Policies</NavLink>
            </div>
          </div>
          <NavLink to="/account/profile" className="nav-link">Account</NavLink>
        </nav>
 
  {isAuthenticated ? (
          <div className="user-profile">
            <div className="user-info">
              <FaUserCircle className="user-icon" />
              <span className="user-name">Hi, {user?.first_name || user?.firstName}</span>
            </div>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <NavLink to="/signup" className="auth-link signup">Create Account</NavLink>
            <NavLink to="/login" className="auth-link login">Login</NavLink>
          </div>
        )}

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className={`mobile-nav ${menuOpen ? 'show' : ''}`}>
        <NavLink to="/" className="mobile-dropdown-item" onClick={() => setMenuOpen(false)}>Home</NavLink>

        <div className="mobile-nav-item">
          <div className="mobile-group-label">Quick Links</div>
          <NavLink to="/PreRequest" className="mobile-dropdown-subitem" onClick={() => setMenuOpen(false)}>Submit Request</NavLink>
          <NavLink to="/CaseStatus" className="mobile-dropdown-subitem" onClick={() => setMenuOpen(false)}>Case Status</NavLink>
          <NavLink to="/ReturnPolicy" className="mobile-dropdown-subitem" onClick={() => setMenuOpen(false)}>Policies</NavLink>
        </div>

        <NavLink to="/account/profile" className="mobile-dropdown-item" onClick={() => setMenuOpen(false)}>Account</NavLink>
        <NavLink to="/signup" className="mobile-dropdown-item" onClick={() => setMenuOpen(false)}>Create Account</NavLink>
        <NavLink to="/login" className="mobile-dropdown-item" onClick={() => setMenuOpen(false)}>Login</NavLink>
      </nav>
    </header>
  );
};

export default Header;