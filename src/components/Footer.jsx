import React from 'react';  
import { FaHome, FaEnvelope, FaUserShield } from 'react-icons/fa';
import '../styles/Footer.css'; // Import the CSS file for styling
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

          <a href="/contact" className="footer-link">
            <FaEnvelope className="footer-icon" />
            <span>Contact Us</span>
          </a>
         <a
  href="https://martrma.returnsportal.net/admin/AdminLogin.aspx"
  className="footer-link"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaUserShield className="footer-icon" />
  <span>Admin</span>
</a>

        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Mart Networks RMA Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;