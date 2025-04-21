import React from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
    const testimonials = [
        { id: 1, text: "StudyBuddy helped me ace my JEE exam!", author: "Himanshu C." },
        { id: 2, text: "The study groups feature is a game-changer!", author: "Hitesh M." },
        { id: 3, text: "Mental health support is crucial for overall well-being.", author: "Kishori G." },
      ];

  return (
    <main>
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <h2 style={styles.heroTitle}>Study Together,<br />Grow Together</h2>
        <p style={styles.heroSubtitle}>Join StudyBuddy and excel in your exams with collaborative learning and personalized support.</p>
        <Link to="/auth" state={{from: "signUp"}} style={styles.ctaButton}>Get Started</Link>
      </div>
      <div style={styles.heroShape}></div>
    </section>

    <section style={styles.features}>
      <h3 style={styles.sectionTitle}>Key Features</h3>
      <div style={styles.featureList}>
        <div style={styles.featureItem}>
          <h4 style={styles.featureTitle}>Study Groups</h4>
          <p style={styles.featureText}>Collaborate with peers in real-time</p>
        </div>
        <div style={styles.featureItem}>
          <h4 style={styles.featureTitle}>Live Chat</h4>
          <p style={styles.featureText}>Instant communication with study partners</p>
        </div>
        <div style={styles.featureItem}>
          <h4 style={styles.featureTitle}>Quizzes</h4>
          <p style={styles.featureText}>Test your knowledge and track progress</p>
        </div>
        <div style={styles.featureItem}>
          <h4 style={styles.featureTitle}>Mental Health Support</h4>
          <p style={styles.featureText}>AI-powered wellness recommendations</p>
        </div>
      </div>
    </section>

    <section style={styles.testimonials}>
      <h3 style={styles.sectionTitle}>What Our Users Say</h3>
      <div style={styles.testimonialSlider}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} style={styles.testimonialItem}>
            <p style={styles.testimonialText}>"{testimonial.text}"</p>
            <p style={styles.testimonialAuthor}>- {testimonial.author}</p>
          </div>
        ))}
      </div>
    </section>
  </main>

  );
};

const styles = {
    hero: {
        position: 'relative',
        padding: '6rem 5%',
        backgroundColor: '#fff',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      },
      heroContent: {
        width: '50%',
        position: 'relative',
        zIndex: 2,
      },
      heroShape: {
        position: 'absolute',
        right: '-10%',
        top: '0',
        width: '60%',
        height: '100%',
        backgroundColor: '#FF4500',
        borderRadius: '0 0 0 100%',
        zIndex: 1,
      },
      heroTitle: {
        fontSize: '3.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        color: '#333',
      },
      heroSubtitle: {
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '2rem',
        maxWidth: '80%',
      },
      ctaButton: {
        display: 'inline-block',
        padding: '1rem 2rem',
        backgroundColor: '#FF4500',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        borderRadius: '25px',
        transition: 'background-color 0.3s',
        fontSize: '1.1rem',
      },
      features: {
        padding: '6rem 5%',
        backgroundColor: '#f8f9fa',
      },
      sectionTitle: {
        fontSize: '2.5rem',
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#333',
        fontWeight: 'bold',
      },
      featureList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      },
      featureItem: {
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s',
        ':hover': {
          transform: 'translateY(-5px)',
        },
      },
      featureTitle: {
        fontSize: '1.5rem',
        color: '#FF4500',
        marginBottom: '1rem',
        fontWeight: 'bold',
      },
      featureText: {
        color: '#666',
      },
      testimonials: {
        padding: '6rem 5%',
        backgroundColor: '#fff',
      },
      testimonialSlider: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      },
      testimonialItem: {
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
      testimonialText: {
        fontSize: '1.1rem',
        fontStyle: 'italic',
        marginBottom: '1rem',
        color: '#333',
      },
      testimonialAuthor: {
        fontWeight: 'bold',
        color: '#FF4500',
        textAlign: 'right',
      }
};

export default Main;