import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaExchangeAlt,
  FaHistory,
  FaUserCog,
  FaFileAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Desktop collapsed toggle
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile toggle
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, route: "/" },
    { name: "RMA Requests", icon: <FaExchangeAlt />, route: "/PreRequest" },
    { name: "Case Status", icon: <FaHistory />, route: "/RmaStatus" },
    { name: "Account", icon: <FaUserCog />, route: "/Account" },
    { name: "Policies", icon: <FaFileAlt />, route: "/ReturnPolicy" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {isOpen && <h1>RMA Portal</h1>}
          <button className="collapse-btn" onClick={() => setIsOpen(!isOpen)}>
            <FaBars />
          </button>
        </div>

        <ul className="menu">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => navigate(item.route)}
              className="menu-item"
            >
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="text">{item.name}</span>}
            </li>
          ))}
        </ul>

       
      </div>

      {/* Mobile Toggle */}
      <div className="mobile-navbar">
        <h1>RMA Portal</h1>
        <button onClick={() => setMobileOpen(true)}>
          <FaBars />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${mobileOpen ? "show" : ""}`}>
        <div className="mobile-header">
          <h1>RMA Portal</h1>
          <button onClick={() => setMobileOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <ul className="menu">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                navigate(item.route);
                setMobileOpen(false);
              }}
              className="menu-item"
            >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.name}</span>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">© 2025 MartRMA</div>
      </div>
    </>
  );
};

export default Sidebar;
