import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineArrowPath,
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineArrowLeftOnRectangle,
    HiOutlineBars3
} from 'react-icons/hi2';
import './styles/AdminSidebar.css';

const menuItems = [
  {
    to: '/admin/rmas/dashboard',
    label: 'Dashboard',
    icon: <HiOutlineHome />,
  },
  {
    to: '/admin/rmas',
    label: 'RMA Management',
    icon: <HiOutlineArrowPath />,
    submenu: [
      
      { to: '/admin/rmas/pending', label: 'Pending Approval' },
      { to: '/admin/rmas/approved', label: 'Approved RMAs' },
      { to: '/admin/rmas/rejected', label: 'Rejected RMAs' },
      { to: '/admin/rmas/processing', label: 'Processing RMAs' },
      { to: '/admin/rmas/bulk', label: 'Bulk Management' },
      { to: '/admin/rmas/manage', label: 'Manage Cases' },
    ]
  },
  {
    to: '/admin/customers',
    label: 'Customer Management',
    icon: <HiOutlineUserGroup />,
    submenu: [
      { to: '/admin/customers/list', label: 'Customer List' },
      { to: '/admin/customers/create', label: 'Create Customer' },
    ]
  },
  {
    to: '/admin/products',
    label: 'Product Management',
    icon: <HiOutlineCube />,
    submenu: [
      { to: '/admin/products', label: 'Product List' },
      { to: '/admin/products/create', label: 'Create Product' },
    ]
  },
  {
    to: '/admin/reports',
    label: 'Reports',
    icon: <HiOutlineChartBar />,
    submenu: [
      { to: '/admin/reports/rma-volume', label: 'RMA Volume' },
      { to: '/admin/reports/turnaround', label: 'Turnaround Time' },
      { to: '/admin/reports/reason-codes', label: 'Return Reasons' },
    ]
  },
  {
    to: '/admin/settings',
    label: 'System Settings',
    icon: <HiOutlineCog />,
    submenu: [
      { to: '/admin/settings/general', label: 'General' },
      { to: '/admin/settings/shipping', label: 'Shipping' },
      { to: '/admin/settings/return-reasons', label: 'Return Reasons' },
    ]
  }
];

const AdminSidebar = ({ isOpen, onLogout, user = { name: 'Admin', role: 'System Administrator' } }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const toggleSubmenu = (key) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isParentActive = (submenu) => {
    return submenu.some(item => location.pathname.startsWith(item.to));
  };

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : 'is-closed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <span className="logo">{sidebarOpen ? 'RMA Admin' : 'R'}</span>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
         <HiOutlineBars3 />

        </button>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        <ul className="menu">
          {menuItems.map(({ to, label, icon, submenu }) => {
            const isOpen = openMenus[to];
            const hasSubmenu = Array.isArray(submenu);
            const isActiveParent = hasSubmenu && isParentActive(submenu);

            return (
              
              <li key={to} className={`menu-item ${isActiveParent ? 'active-parent' : ''}`}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `menu-link ${isActive && !hasSubmenu ? 'active' : ''}`
                  }
                  onClick={(e) => hasSubmenu ? (e.preventDefault(), toggleSubmenu(to)) : null}
                >
                  <span className="menu-icon">{icon}</span>
                  {sidebarOpen && <span className="menu-label">{label}</span>}
                  {hasSubmenu && sidebarOpen && (
                    <span className="submenu-arrow">
                      {isOpen ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
                    </span>
                  )}
                </NavLink>

                {/* Submenu */}
                {hasSubmenu && isOpen && (
                  <ul className="submenu">
                    {submenu.map(({ to: subTo, label: subLabel }) => (
                      <li key={subTo}>
                        <NavLink to={subTo} className="submenu-link">
                          {sidebarOpen ? subLabel : subLabel.charAt(0)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

     
    </aside>
  );
};

export default AdminSidebar;
