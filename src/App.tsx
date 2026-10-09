/**
 * MAIN APPLICATION COMPONENT - APP.TSX
 * 
 * This is the "master control center" of your website. Think of it like the 
 * brain that coordinates everything else.
 * 
 * 🏗️ What this file does:
 * 1. Sets up the overall structure of your website
 * 2. Manages feature flags (on/off switches for features)
 * 3. Controls navigation between different pages
 * 4. Shows debug tools when in development/staging mode
 * 
 * 🎯 Think of it like: The conductor of an orchestra - coordinates all the 
 *    musicians (components) to play together harmoniously
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all the page components (the main "rooms" of your website)
import Home from './pages/Home';                    // Landing page with navigation
import Work from './pages/Work';                    // Portfolio showcase  
import About from './pages/About';                  // Personal information
import Consulting from './pages/Consulting';        // Services offered
import StyleGuide from './pages/StyleGuide';        // Design system documentation
import ProjectPage from './pages/ProjectPage';      // Individual project details

// Import utility components for staging/development
import FloatingStagingBanner from './components/FloatingStagingBanner';     // "Staging site" indicator
import FeatureFlagDebugPanel from './components/FeatureFlagDebugPanel';     // Feature toggle controls
import AppNavigation from './components/AppNavigation';                     // Top navigation bar

// Import feature flag system
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';        // Feature flag state management
import { useFeatureFlag } from './hooks/useFeatureFlag';                    // Hook to check feature flags

// Import mini-app components (features that can be toggled on/off)
import NotesApp from './components/NotesApp';                    // Note-taking application
import CrewGeneratorIframe from './components/CrewGeneratorIframe'; // Crew generator app

/**
 * Main App Content Component
 * 
 * This component contains all the logic for:
 * - Detecting what environment we're in (development, staging, production)
 * - Showing the appropriate debug tools
 * - Setting up navigation between pages
 * - Managing the overall layout
 */
const AppContent: React.FC = () => {
  /**
   * STAGING ENVIRONMENT DETECTION
   * 
   * This code figures out if we're on the staging website or the live website.
   * Staging = Preview version for testing
   * Production = Live website that real users see
   * 
   * 🔍 How it works: Looks at the website's URL to determine environment
   */
  const [isStaging, setIsStaging] = React.useState(false);
  
  /**
   * Get the current debug mode setting from feature flags
   * This controls whether debug tools should be visible by default
   */
  const debugMode = useFeatureFlag('debugMode');

  /**
   * Effect to detect staging environment
   * 
   * This runs once when the component loads and checks the website URL.
   * If the URL contains "staging" or "localhost", we know we're not on the live site.
   * 
   * 🏠 localhost = Your computer during development
   * 🎭 staging = Preview site for testing
   * 🚀 anything else = Live production site
   */
  React.useEffect(() => {
    // Get the current website's URL hostname (like "staging.yoursite.com")
    const hostname = window.location.hostname;
    
    // Check if this looks like a development or staging environment
    const staging = hostname.includes('staging') || hostname.includes('localhost');
    
    // Remember this for the rest of the session
    setIsStaging(staging);
    
    // Log this info to the browser console for debugging
    console.log('🔍 Staging detection:', { hostname, staging });
  }, []); // Empty array = only run this once when component loads
  
  /**
   * DEBUG PANEL VISIBILITY CONTROL
   * 
   * This manages whether the feature flag debug panel is visible.
   * It has three possible states:
   * - null: Follow the debugMode feature flag setting
   * - true: Force the panel to show (user manually turned it on)
   * - false: Force the panel to hide (user manually turned it off)
   * 
   * 🎛️ Think of it like: A manual override switch on an automatic system
   */
  const [debugPanelOverride, setDebugPanelOverride] = React.useState<boolean | null>(null);
  
  /**
   * Function to toggle the debug panel on/off
   * 
   * This function is called when someone clicks the debug panel toggle button.
   * It smartly figures out what the new state should be based on current state.
   */
  const toggleDebugPanel = () => {
    setDebugPanelOverride(prev => {
      // If we're currently following the feature flag (null state)
      if (prev === null) {
        // Set the opposite of what the feature flag says
        return !debugMode;
      }
      // If we're in manual control mode, just flip the switch
      return !prev;
    });
  };
  
  /**
   * Calculate whether the debug panel should actually be visible
   * 
   * Priority order:
   * 1. If user manually set it (debugPanelOverride), use that
   * 2. Otherwise, use the feature flag setting (debugMode)
   * 
   * 🎯 Logic: Manual override beats automatic settings
   */
  const shouldShowDebugPanel = debugPanelOverride !== null ? debugPanelOverride : debugMode;
  
  /**
   * RENDER THE COMPLETE WEBSITE STRUCTURE
   * 
   * This return statement builds the entire website layout.
   * Think of it like assembling a house from components:
   * 🏠 Router = The foundation that handles navigation
   * 🚪 Routes = Different rooms people can visit
   * 🎛️ Debug tools = Special equipment only visible during construction
   */
  return (
    <Router>
      <div className="App">
        {/* 
          🎯 FLOATING STAGING BANNER
          
          This green floating banner only appears on staging/development sites.
          It tells visitors "this is not the live website" and provides developer tools.
          
          ✅ Shows when: isStaging = true (staging.yoursite.com or localhost)
          ❌ Hidden when: Live production site
          
          🔧 What it does:
          - Shows "Staging - not a live site" message
          - Provides button to toggle feature flag debug panel
          - Links to style guide for design system documentation
        */}
        {isStaging && (
          <FloatingStagingBanner 
            onToggleDebugPanel={toggleDebugPanel}           // Function to show/hide debug panel
            isDebugPanelVisible={shouldShowDebugPanel}      // Current visibility state
          />
        )}
        
        {/* 
          🚩 FEATURE FLAG DEBUG PANEL
          
          This panel lets developers and testers toggle features on/off instantly.
          Think of it like a control room with switches for every feature.
          
          ✅ Shows when: shouldShowDebugPanel = true
          ❌ Hidden when: shouldShowDebugPanel = false
          
          🔧 What it includes:
          - ON/OFF switches for every feature flag
          - Real-time preview of changes (no page refresh needed)
          - Status indicators (working vs placeholder features)
          - Organized by categories (Mini Apps, Development, UI, Database)
        */}
        {isStaging && shouldShowDebugPanel && <FeatureFlagDebugPanel />}
        
        {/* 
          📱 APP NAVIGATION BAR
          
          This is the horizontal blue navigation bar that appears at the top.
          It only shows when mini-apps are enabled via feature flags.
          
          🔍 Logic: If no mini-apps are enabled, no navigation bar appears
          ✅ Shows: "APPS | PORTFOLIO NOTES CREW" etc. based on enabled flags
          
          🎯 Smart behavior:
          - Only shows navigation for enabled features
          - Highlights current page with different background
          - Responsive design (adapts to different screen sizes)
        */}
        {isStaging && <AppNavigation />}
        
        {/* 
          🚪 ROUTE DEFINITIONS - All the "rooms" in your website
          
          Routes define what content shows when someone visits different URLs.
          Think of URLs like street addresses for different rooms in your house.
          
          📍 Static Routes (always available):
          - "/" = Home page (landing page with main navigation)
          - "/work" = Portfolio showcase page
          - "/about" = About me page
          - "/consulting" = Consulting services page
          - "/style-guide" = Design system documentation
          - "/project/:id" = Individual project detail pages (dynamic)
          
          🎮 Feature-Flagged Routes (only available when flags are enabled):
          - "/notes" = Note-taking mini-app
          - "/crew" = Crew generator mini-app
          
          💡 How it works: When someone visits "/about", React shows the <About /> component
        */}
        <Routes>
          {/* CORE WEBSITE PAGES - Always available */}
          <Route path="/" element={<Home />} />                    {/* Landing page */}
          <Route path="/work" element={<Work />} />                {/* Portfolio */}
          <Route path="/about" element={<About />} />              {/* About me */}
          <Route path="/consulting" element={<Consulting />} />    {/* Services */}
          <Route path="/style-guide" element={<StyleGuide />} />   {/* Design docs */}
          <Route path="/project/:id" element={<ProjectPage />} />  {/* Project details */}
          
          {/* MINI-APP ROUTES - Controlled by feature flags */}
          <Route path="/notes" element={<NotesApp />} />                    {/* 📝 Note-taking app */}
          <Route path="/crew" element={<CrewGeneratorIframe />} />          {/* 🚀 Crew generator */}
        </Routes>
      </div>
    </Router>
  );
};

/**
 * MAIN APP WRAPPER FUNCTION
 * 
 * This is the outermost container that wraps everything else.
 * Its main job is to provide the feature flag system to the entire app.
 * 
 * 🎯 Think of it like: The electrical system that powers your entire house
 *    before you can turn on any individual lights (features)
 * 
 * 🔌 What FeatureFlagProvider does:
 * - Makes feature flag system available to ALL components
 * - Manages the current state of all feature flags
 * - Handles saving/loading flag settings from browser storage
 * - Provides functions to turn flags on/off
 * 
 * 🏗️ Structure:
 * App() → FeatureFlagProvider → AppContent → All other components
 */
function App() {
  return (
    <FeatureFlagProvider>  {/* Wraps everything to provide feature flag context */}
      <AppContent />        {/* The actual website content and logic */}
    </FeatureFlagProvider>
  );
}

// Export this component so it can be used by index.tsx to start the website
export default App; 