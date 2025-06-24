import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/martLogo.png';
import {
  FaTachometerAlt,
  FaExchangeAlt,
  FaHistory,
  FaUserCog,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const Top = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (tab) => {
    setActiveDropdown(activeDropdown === tab ? null : tab);
  };

  const navLinks = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/' },
    { name: 'RMA Requests', icon: <FaExchangeAlt />, route: '/PreRequest' },
    { name: 'Case Status', icon: <FaHistory />, route: '/CaseStatus' },
    { 
      name: 'Account', 
      icon: <FaUserCog />,
      route: '/Account',
      submenu: [
        { name: 'Profile', route: '/account/profile' },
        { name: 'Settings', route: '/account/settings' },
        { name: 'Logout', action: logout }
      ]
    },
    { name: 'Policies', icon: <FaFileAlt />, route: '/ReturnPolicy' }
  ];

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="auth-links">
            {isAuthenticated ? (
              <div className="user-info">
                <span className="user-email">{user?.email}</span>
              </div>
            ) : (
              <>
                <Link to="/login" className="auth-link login">
                  Login
                </Link>
                <Link to="/signup" className="auth-link signup">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="Mart Networks Logo" className="logo-img" />
            <span className="logo-text">Mart Networks RMA System</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className={`nav-item ${link.submenu ? 'has-dropdown' : ''}`}
                onMouseEnter={() => link.submenu && setActiveDropdown(link.name)}
                onMouseLeave={() => link.submenu && setActiveDropdown(null)}
              >
                <NavLink 
                  to={link.route}
                  className="nav-link"
                  activeClassName="active"
                  exact
                >
                  <span className="nav-icon">{link.icon}</span>
                  {link.name}
                  {link.submenu && (
                    <span className="dropdown-icon">
                      {activeDropdown === link.name ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </NavLink>

                {link.submenu && activeDropdown === link.name && (
                  <div className="dropdown-menu">
                    {link.submenu.map((item) => (
                      item.action ? (
                        <button 
                          key={item.name}
                          onClick={item.action}
                          className="dropdown-item"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.route}
                          className="dropdown-item"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <div key={link.name} className="mobile-nav-item">
                <div 
                  className="mobile-nav-header"
                  onClick={() => toggleDropdown(link.name)}
                >
                  <NavLink 
                    to={link.route}
                    className="mobile-nav-link"
                    activeClassName="active"
                    exact
                  >
                    <span className="nav-icon">{link.icon}</span>
                    {link.name}
                  </NavLink>
                  {link.submenu && (
                    <span className="dropdown-icon">
                      {activeDropdown === link.name ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </div>

                {link.submenu && activeDropdown === link.name && (
                  <div className="mobile-dropdown-menu">
                    {link.submenu.map((item) => (
                      item.action ? (
                        <button 
                          key={item.name}
                          onClick={() => {
                            item.action();
                            setMobileMenuOpen(false);
                          }}
                          className="mobile-dropdown-item"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.route}
                          className="mobile-dropdown-item"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      <style jsx>{`
        /* Base Styles */
        .header {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        /* Top Bar */
        .top-bar {
          background: #2c3e50;
          color: white;
          padding: 8px 0;
          font-size: 14px;
        }
        
        .auth-links {
          display: flex;
          gap: 20px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .user-email {
          color: #ecf0f1;
        }
        
        .auth-link {
          color: white;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        
        .auth-link:hover {
          opacity: 0.8;
        }
        
        .auth-link.login {
          color: #3498db;
        }
        
        .auth-link.signup {
          color: #2ecc71;
        }
        
        /* Main Header */
        .main-header {
          background: white;
          padding: 15px 0;
          position: relative;
        }
        
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          gap: 10px;
        }
        
        .logo-img {
          height: 40px;
        }
        
        .logo-text {
          color: #2c3e50;
          font-weight: 600;
          font-size: 18px;
        }
        
        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
          gap: 10px;
        }
        
        .nav-item {
          position: relative;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          text-decoration: none;
          color: #555;
          font-weight: 500;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .nav-link:hover, .nav-link.active {
          background: #f5f7fa;
          color: #3498db;
        }
        
        .dropdown-icon {
          margin-left: 5px;
          font-size: 12px;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          min-width: 200px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border-radius: 4px;
          z-index: 100;
          padding: 5px 0;
        }
        
        .dropdown-item {
          display: block;
          padding: 10px 15px;
          text-decoration: none;
          color: #555;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .dropdown-item:hover {
          background: #f5f7fa;
          color: #3498db;
        }
        
        /* Mobile Navigation */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #2c3e50;
        }
        
        .mobile-nav {
          display: none;
          background: white;
          width: 100%;
          position: absolute;
          left: 0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .mobile-nav-item {
          border-bottom: 1px solid #eee;
        }
        
        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          cursor: pointer;
        }
        
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #555;
        }
        
        .mobile-nav-link.active {
          color: #3498db;
        }
        
        .mobile-dropdown-menu {
          background: #f9f9f9;
          padding-left: 20px;
        }
        
        .mobile-dropdown-item {
          display: block;
          padding: 12px 20px;
          text-decoration: none;
          color: #555;
        }
        
        /* Responsive Styles */
        @media (max-width: 992px) {
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
          }
          
          .mobile-nav {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Top;