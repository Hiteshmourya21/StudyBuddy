import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
 

  return (
    <footer style={styles.footer}>
    <div style={styles.footerContent}>
      <div style={styles.footerSection}>
        <h4 style={styles.footerTitle}>Contact Us</h4>
        <p>Email: support@studybuddy.com</p>
        <p>Phone: +91 1234567890</p>
      </div>
      <div style={styles.footerSection}>
        <h4 style={styles.footerTitle}>Follow Us</h4>
        <div style={styles.socialLinks}>
          <a href="#" style={styles.socialLink}>Facebook</a>
          <a href="#" style={styles.socialLink}>Twitter</a>
          <a href="#" style={styles.socialLink}>Instagram</a>
        </div>
      </div>
      <div style={styles.footerSection}>
        <h4 style={styles.footerTitle}>Quick Links</h4>
        <Link to="/faq" style={styles.footerLink}>FAQs</Link>
        <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
        <Link to="/terms" style={styles.footerLink}>Terms of Service</Link>
      </div>
    </div>
    <p style={styles.copyright}>&copy; 2024 StudyBuddy. All rights reserved.</p>
  </footer>

  );
};

const styles = {
    footer: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '4rem 5% 2rem',
      },
      footerContent: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        maxWidth: '1200px',
        margin: '0 auto',
      },
      footerSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      },
      footerTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#FF4500',
      },
      socialLinks: {
        display: 'flex',
        gap: '1rem',
      },
      socialLink: {
        color: '#fff',
        textDecoration: 'none',
        transition: 'color 0.3s',
      },
      footerLink: {
        color: '#fff',
        textDecoration: 'none',
        transition: 'color 0.3s',
      },
      copyright: {
        textAlign: 'center',
        marginTop: '3rem',
        padding: '1rem 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: '#999',
      },
  
};

export default Footer;