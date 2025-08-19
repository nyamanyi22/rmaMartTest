import React from 'react';
import Header from '../components/header';
import Footer from '../components/Footer';
import { FaMapMarkerAlt, FaPhone, FaFax, FaBuilding, FaClock } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <Header />

      <main className="contact-main">
        <div className="contact-card">
          {/* Header */}
          <div className="contact-header">
            <h3>
              <FaBuilding className="contact-icon" /> Contact Mart Networks
            </h3>
          </div>

          {/* Body */}
          <div className="contact-body">
            {/* Left Column - Contact Info */}
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt size={20} className="contact-icon-left" />
                <div>
                  <h2>Our Location</h2>
                  <p>2nd Floor, Museum Hill Centre<br />Opp. Kenya, Nairobi 90136, KE</p>
                </div>
              </div>

              <div className="contact-item">
                <FaPhone size={20} className="contact-icon-left" />
                <div>
                  <h2>Phone</h2>
                  <p><a href="tel:0797466958" className="contact-link">0797466958</a></p>
                </div>
              </div>

              <div className="contact-item">
                <FaFax size={20} className="contact-icon-left" />
                <div>
                  <h2>Fax</h2>
                  <p>[Insert Fax Info]</p>
                </div>
              </div>

              <div className="contact-item">
                <FaClock size={20} className="contact-icon-left" />
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

            {/* Right Column - Map */}
          <div className="contact-map">
  <iframe
    title="Mart Networks Location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.1234567890!2d36.8165!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f123456789abc%3A0xabcdef1234567890!2sMuseum%20Hill%20Centre%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1692436731234!5m2!1sen!2ske"
    width="100%"
    height="300"
    style={{ border: 0, borderRadius: '12px' }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
  <button
    className="map-button"
    onClick={() =>
      window.open(
        'https://www.google.com/maps/place/Museum+Hill+Centre,+Nairobi',
        '_blank'
      )
    }
  >
    View on Google Maps
  </button>
</div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
