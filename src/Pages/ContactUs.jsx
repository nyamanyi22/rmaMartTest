import React from 'react';
import Footer from '../components/Footer';
import { FaMapMarkerAlt, FaPhone, FaFax, FaBuilding, FaClock } from 'react-icons/fa';
import '../styles/Contact.css'; // Import the CSS file

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Header */}

      
      {/* Main Content */}
      <main className="contact-main">
        <div className="contact-card">
          {/* Contact Header */}
          <div className="contact-header">
            <h3>
              <FaBuilding className="contact-icon" /> Contact Mart Networks
            </h3>
          </div>
          
          {/* Contact Body */}
          <div className="contact-body">
            {/* Left Column - Contact Info */}
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h2>Our Location</h2>
                  <p>
                    2nd Floor, Museum Hill Centre<br />
                    Opp. Kenya, Nairobi 90136, KE
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FaPhone size={20} />
                </div>
                <div>
                  <h2>Phone</h2>
                  <p>
                    <a href="tel:0797466958" className="contact-link">
                      0797466958
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FaFax size={20} />
                </div>
                <div>
                  <h2>Fax</h2>
                  <p>[Insert Fax Info]</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FaClock size={20} />
                </div>
                <div>
                  <h2>Business Hours</h2>
                  <p>
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Map Placeholder */}
            <div className="contact-map">
              <div className="map-placeholder">
                <div className="map-container">
                  <FaMapMarkerAlt size={40} className="map-icon" />
                </div>
                <p className="contact-item">Our location on map</p>
                <button className="map-button">
                  View on Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;