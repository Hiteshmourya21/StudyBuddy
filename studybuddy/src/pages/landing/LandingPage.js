import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const LandingPage = () => {
  

  return (
    <>
      <Header />
      <div style={styles.container}>

      <Main />
    
      <Footer />     
      
    </div>
    </>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    color: '#333',
    lineHeight: 1.6,
    backgroundColor: '#fff',
  },
  
};

export default LandingPage;