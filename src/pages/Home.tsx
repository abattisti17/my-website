import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* 🎯 STAGING TEST BANNER - This will show on staging.alessandrobattisti.com */}
      <div style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '12px',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: '20px',
        border: '3px solid #45a049'
      }}>
        🚀 STAGING DEPLOYMENT TEST - CI/CD Pipeline Working! 🚀
      </div>
      
      <div className="home-header">
        <h1 className="home-title">Alessandro Battisti</h1>
        <p className="home-subtitle">Design Researcher & Strategist</p>
      </div>
      
      <div className="home-content">
        <div className="nav-links">
          <Link to="/work" className="nav-link custom-cursor-work">
            My work
          </Link>
          <Link to="/about" className="nav-link custom-cursor-about">
            About me
          </Link>
          <Link to="/consulting" className="nav-link custom-cursor-consulting">
            Consulting
          </Link>
          <Link to="/style-guide" className="nav-link" style={{ fontSize: '14px', opacity: 0.7 }}>
            Style Guide
          </Link>
        </div>
        
        <p className="home-description">
          Together we understand & design for people.
        </p>
        
        <div className="home-footer">
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/alessandrojbattisti/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Linkedin
            </a>
            <span className="email">email: abattisti [at] protonmail [dot] com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 