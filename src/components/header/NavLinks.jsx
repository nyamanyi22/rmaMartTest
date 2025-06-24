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

const NavLinks = () => {
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

  return (
    <nav className="desktop-nav">
      <div 
        className="nav-item has-dropdown"
        onMouseEnter={() => setShowQuickLinks(true)}
        onMouseLeave={() => setShowQuickLinks(false)}
      >
        <div className="nav-link">
          <span>Quick Links</span>
          <span className="dropdown-icon">
            {showQuickLinks ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>

        {showQuickLinks && (
          <div className="dropdown-menu quick-links-menu">
            {quickLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.route}
                className="dropdown-item"
                activeClassName="active"
                exact
              >
                <span className="nav-icon">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div 
        className="nav-item has-dropdown"
        onMouseEnter={() => toggleDropdown('Account')}
        onMouseLeave={() => toggleDropdown('Account')}
      >
        <NavLink 
          to="/Account"
          className="nav-link"
          activeClassName="active"
          exact
        >
          <span className="nav-icon"><FaUserCog /></span>
          Account
          <span className="dropdown-icon">
            {activeDropdown === 'Account' ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </NavLink>

        {activeDropdown === 'Account' && (
          <div className="dropdown-menu">
            {accountLinks.map((item) => (
              item.action ? (
                <button 
                  key={item.name}
                  onClick={item.action}
                  className="dropdown-item"
                >
                  {item.name}
                </button>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.route}
                  className="dropdown-item"
                  activeClassName="active"
                  exact
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

export default NavLinks;