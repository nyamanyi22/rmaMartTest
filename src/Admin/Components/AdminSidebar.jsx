import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  const menuItems = [
    { 
      to: '/admin', 
      label: '📊 Dashboard', 
      exact: true 
    },
    { 
      to: '/admin/rmas', 
      label: '🔄 RMA Management',
      submenu: [
          { to: '/admin/rmas/search', label: 'Search RMAs' },
    { to: '/admin/rmas/pending', label: 'Pending Approval' },
    { to: '/admin/rmas/approved', label: 'Approved RMAs' },
    { to: '/admin/rmas/rejected', label: 'Rejected RMAs' },
    { to: '/admin/rmas/bulk-actions', label: 'Bulk Actions' }
      ]
    },
    { 
      to: '/admin/customers', 
      label: '👤 Customer Management',
      submenu: [
        { to: '/admin/customers/list', label: 'Customer List' },
        { to: '/admin/customers/import', label: 'Bulk Import' },
      ]
    },
    { 
      to: '/admin/products', 
      label: '🛒 Product Management',
      submenu: [
        { to: '/admin/products/list', label: 'Product Catalog' },
        { to: '/admin/products/serial-numbers', label: 'Serial Numbers' },
      ]
    },
    { 
      to: '/admin/reports', 
      label: '📊 Reports',
      submenu: [
        { to: '/admin/reports/rma-volume', label: 'RMA Volume' },
        { to: '/admin/reports/turnaround', label: 'Turnaround Time' },
        { to: '/admin/reports/reason-codes', label: 'Return Reasons' },
      ]
    },
    { 
      to: '/admin/settings', 
      label: '⚙️ System Settings',
      submenu: [
        { to: '/admin/settings/general', label: 'General' },
        { to: '/admin/settings/shipping', label: 'Shipping' },
        { to: '/admin/settings/return-reasons', label: 'Return Reasons' },
      ]
    },
  ];

  // Automatically open submenu when on a sub-route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeParent = menuItems.find(item => 
      item.submenu && item.submenu.some(subItem => subItem.to === currentPath)
    );
    
    if (activeParent) {
      setActiveSubmenu(activeParent.to);
    }
  }, [location.pathname]);

  const toggleSubmenu = (to) => {
    setActiveSubmenu(activeSubmenu === to ? null : to);
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">RMA Admin</h2>
        <div className="sidebar-version">v2.1.0</div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li 
              key={item.to}
              className={`menu-item ${item.submenu ? 'has-submenu' : ''}`}
            >
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) => 
                  `menu-link ${isActive ? 'active' : ''}`
                }
                onClick={() => item.submenu && toggleSubmenu(item.to)}
              >
                <span className="menu-icon">{item.label.split(' ')[0]}</span>
                <span className="menu-text">
                  {item.label.replace(/^[^\s]+\s/, '')}
                </span>
                {item.submenu && (
                  <span className="submenu-toggle">
                    {activeSubmenu === item.to ? '▾' : '▸'}
                  </span>
                )}
              </NavLink>

              {item.submenu && activeSubmenu === item.to && (
                <ul className="submenu">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.to}>
                      <NavLink
                        to={subItem.to}
                        className={({ isActive }) => 
                          `submenu-link ${isActive ? 'active' : ''}`
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <div className="user-name">Admin User</div>
            <div className="user-role">System Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}