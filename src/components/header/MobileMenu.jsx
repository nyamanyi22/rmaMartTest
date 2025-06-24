import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaTachometerAlt,
  FaExchangeAlt,
  FaHistory,
  FaUserCog,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const MobileMenu = ({ isOpen, closeMenu }) => {
  const { logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showQuickLinks, setShowQuickLinks] = useState(false);

  const accountLinks = [
    { name: 'Profile', route: '/account/profile' },
    { name: 'Settings', route: '/account/settings' },
    { name: 'Logout', action: logout }
  ];

  const quickLinks = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, route: '/' },
    { name: 'RMA Requests', icon: <FaExchangeAlt />, route: '/PreRequest' },
    { name: 'Case Status', icon: <FaHistory />, route: '/CaseStatus' },
    { name: 'Policies', icon: <FaFileAlt />, route: '/ReturnPolicy' }
  ];

  const toggleDropdown = (tab) => {
    setActiveDropdown(activeDropdown === tab ? null : tab);
  };

  if (!isOpen) return null;

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-item">
        <div 
          className="mobile-nav-header"
          onClick={() => setShowQuickLinks(!showQuickLinks)}
        >
          <div className="mobile-nav-link">
            Quick Links
          </div>
          <span className="dropdown-icon">
            {showQuickLinks ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>

        {showQuickLinks && (
          <div className="mobile-dropdown-menu">
            {quickLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.route}
                className="mobile-dropdown-item"
                activeClassName="active"
                exact
                onClick={closeMenu}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className="mobile-nav-item">
        <div 
          className="mobile-nav-header"
          onClick={() => toggleDropdown('Account')}
        >
          <NavLink 
            to="/Account"
            className="mobile-nav-link"
            activeClassName="active"
            exact
          >
            <span className="nav-icon"><FaUserCog /></span>
            Account
          </NavLink>
          <span className="dropdown-icon">
            {activeDropdown === 'Account' ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>

        {activeDropdown === 'Account' && (
          <div className="mobile-dropdown-menu">
            {accountLinks.map((item) => (
              item.action ? (
                <button 
                  key={item.name}
                  onClick={() => {
                    item.action();
                    closeMenu();
                  }}
                  className="mobile-dropdown-item"
                >
                  {item.name}
                </button>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.route}
                  className="mobile-dropdown-item"
                  activeClassName="active"
                  exact
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileMenu;