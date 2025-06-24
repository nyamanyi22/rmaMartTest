import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/martLogo.png';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';

const MainHeader = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="main-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="Mart Networks Logo" className="logo-img" />
          <span className="logo-text">Mart Networks RMA System</span>
        </Link>

        <NavLinks />
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        closeMenu={() => setMobileMenuOpen(false)} 
      />
    </div>
  );
};

export default MainHeader;