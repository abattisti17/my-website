import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Consulting from './pages/Consulting';
import StyleGuide from './pages/StyleGuide';
import ProjectPage from './pages/ProjectPage';
import FloatingStagingBanner from './components/FloatingStagingBanner';

function App() {
  const isStaging = process.env.REACT_APP_ENVIRONMENT === 'staging';
  
  return (
    <Router>
      <div className="App">
        {/* 🎯 FLOATING STAGING BANNER - Persistent on all pages */}
        {isStaging && <FloatingStagingBanner />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 