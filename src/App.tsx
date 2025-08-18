import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Consulting from './pages/Consulting';
import StyleGuide from './pages/StyleGuide';
import ProjectPage from './pages/ProjectPage';
import FloatingStagingBanner from './components/FloatingStagingBanner';
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';
import { useFeatureFlag } from './hooks/useFeatureFlag';
import FeatureFlagDebugPanel from './components/FeatureFlagDebugPanel';
import NotesApp from './components/NotesApp';
import CrewGeneratorIframe from './components/CrewGeneratorIframe';
import AppNavigation from './components/AppNavigation';

const AppContent: React.FC = () => {
  // Force staging mode since process.env is not available in browser
  const isStaging = true;  // Always show staging features for now
  const debugMode = useFeatureFlag('debugMode');
  
  // Local state for debug panel visibility
  // null = follow debugMode flag, true = force show, false = force hide
  const [debugPanelOverride, setDebugPanelOverride] = React.useState<boolean | null>(null);
  
  const toggleDebugPanel = () => {
    setDebugPanelOverride(prev => {
      // If currently following debugMode, set opposite of current state
      if (prev === null) {
        return !debugMode;
      }
      // If manually controlled, toggle
      return !prev;
    });
  };
  
  // Determine if debug panel should show
  const shouldShowDebugPanel = debugPanelOverride !== null ? debugPanelOverride : debugMode;
  
  return (
    <Router>
      <div className="App">
        {/* 🎯 FLOATING STAGING BANNER - Persistent on all pages */}
        {isStaging && (
          <FloatingStagingBanner 
            onToggleDebugPanel={toggleDebugPanel}
            isDebugPanelVisible={shouldShowDebugPanel}
          />
        )}
        
        {/* 🚩 FEATURE FLAG DEBUG PANEL - Show based on calculated state */}
        {shouldShowDebugPanel && <FeatureFlagDebugPanel />}
        
        {/* 📱 APP NAVIGATION - Shows when feature-flagged apps are enabled */}
        <AppNavigation />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          {/* 📝 NOTES APP - Feature flagged route */}
          <Route path="/notes" element={<NotesApp />} />
          {/* 🚀 CREW GENERATOR - Feature flagged route */}
          <Route path="/crew" element={<CrewGeneratorIframe />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <FeatureFlagProvider>
      <AppContent />
    </FeatureFlagProvider>
  );
}

export default App; 