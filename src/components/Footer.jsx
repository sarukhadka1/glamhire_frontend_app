import React from 'react';
import './Footer.css'; // Import the Footer specific CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo */}
        <div className="footer-logo">
          <img src="../assets/images/logo.png" alt="Glam Hire Logo" />
        </div>

        {/* Footer Name */}
        <div className="footer-name">
          <h2>Glam Hire</h2>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons d-flex">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>

          <a href='/contact' target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-white p-3 copyright">
        © 2024 Glam Hire. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
