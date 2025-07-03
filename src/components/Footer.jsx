import React from 'react';  
import { FaHome, FaEnvelope, FaUserShield } from 'react-icons/fa';
import '../styles/Footer.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
           
          <a href="/" className="footer-link">
            <FaHome className="footer-icon" />
            <span>Homepage</span>
          </a>
           <a
  href="https://www.mart-networks.com/"
  className="footer-link"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaHome className="footer-icon" />
  <span>Visit our main site</span>
</a>

<Link to="/admin/dashboard" className="footer-link">
  <FaUserShield className="footer-icon" />
  <span>Admin</span>
</Link>



        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Mart Networks RMA Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;