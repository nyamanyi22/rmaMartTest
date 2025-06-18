// src/components/Top.jsx (renamed from Header.js)

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/martLogo.png'; // adjust path if needed

// Import the CSS file (path is correct if Header.css is in the same folder)
import '../styles/Header.css'; // <--- THIS IS THE LINE THE ERROR POINTS TO

const Header = () => { // Note: The function name is still 'Header', but the file is 'Top.jsx'
                       // This is fine, as long as you import it correctly in App.js as 'Top' or 'Header'
                       // It's generally better to match function name to file name, e.g., 'const Top = () => {'
  return (
    <header className="rma-header"> {/* Add the top-level class from CSS */}
      <div className="header-top">
        <div className="container">
          <div className="auth-links">
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/signup" className="signup-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="Mart Networks Logo" />
            <span>Mart Networks RMA Sytem</span>
          </Link>

          <div className="user-actions">
            {/* User info / navigation can go here later */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; // <--- This will be imported as 'Top' in App.js usually