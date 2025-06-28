import React, { useState } from 'react'
import Header from '../components/header/index';
import Sidebar from '../components/Sidebar';
import QuickActions from '../components/QuickAction';

import Footer from '../components/Footer';
import '../index.css';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const userEmail = "";

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="app">
       <Header userEmail={userEmail} onLogout={handleLogout} />
      
      <div className="main-content">
     
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="content-area">
          <h2>Welcome to Mart Network's RMA Portal</h2>
          <p>You need an account to request an RMA. Review our Return Policy before submitting.</p>
          <QuickActions />
         
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
