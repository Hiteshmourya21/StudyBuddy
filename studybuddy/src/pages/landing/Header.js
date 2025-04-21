import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
 

  return (
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>StudyBuddy</Link>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/about" style={styles.navLink}>About Us</Link>
          <Link to="/features" style={styles.navLink}>Features</Link>
          <Link to="/auth" state={{from: "signUp"}} style={{...styles.navLink, ...styles.signUpLink}}>Sign Up</Link>
          <Link to="/auth" state={{from: "signIn"}} style={{...styles.navLink, ...styles.loginLink}}>Login</Link>
        </nav>
      </header>

  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 5%',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    textDecoration: 'none',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#FF4500',
    margin: 0,
  },
  nav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.3s',
  },
  signUpLink: {
    backgroundColor: '#FF4500',
    color: '#fff',
    padding: '0.5rem 1.5rem',
    borderRadius: '25px',
    transition: 'background-color 0.3s',
  },
  loginLink: {
    border: '2px solid #FF4500',
    color: '#FF4500',
    padding: '0.5rem 1.5rem',
    borderRadius: '25px',
    transition: 'all 0.3s',
  },
  
};

export default Header;