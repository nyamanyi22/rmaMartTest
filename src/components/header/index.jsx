import React, { useState } from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import './styles.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <TopBar />
      <MainHeader 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
    </header>
  );
};

export default Header;