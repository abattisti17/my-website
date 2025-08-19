/**
 * APP NAVIGATION COMPONENT
 * 
 * This creates the horizontal blue navigation bar that appears at the top of the website.
 * It's like a smart menu that only shows options for features that are currently enabled.
 * 
 * 🎯 Purpose: 
 * - Provide easy access to mini-apps when they're enabled via feature flags
 * - Show current page with visual highlighting
 * - Automatically hide when no mini-apps are available
 * 
 * 🎨 Visual Design:
 * - Blue background bar across the top
 * - White text on buttons
 * - Darker background for the current page
 * - "APPS | PORTFOLIO" layout with pipe separator
 * 
 * 🧠 Smart Behavior:
 * - Only renders if at least one mini-app is enabled
 * - Dynamically builds navigation based on feature flags
 * - Highlights current page automatically
 * 
 * 💡 Think of it like: A smart TV remote that only shows buttons for 
 *    channels you actually have subscribed to
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

/**
 * Navigation Item Interface
 * 
 * Defines the structure for each navigation item in the bar.
 * Each item needs:
 * - label: What text to show on the button
 * - path: Where to navigate when clicked  
 * - flagKey: Which feature flag controls its visibility
 */
interface NavItem {
  label: string;    // Display text (e.g., "NOTES")
  path: string;     // URL path (e.g., "/notes")
  flagKey: string;  // Feature flag that controls visibility
}

/**
 * Main AppNavigation Component Function
 * 
 * This function contains all the logic for:
 * 1. Detecting which mini-apps are currently enabled
 * 2. Building a navigation menu with only enabled items
 * 3. Highlighting the current page
 * 4. Deciding whether to show the navigation bar at all
 */
const AppNavigation: React.FC = () => {
  /**
   * GET CURRENT PAGE INFORMATION
   * 
   * useLocation() tells us which page the user is currently viewing.
   * This is like asking "what channel is the TV currently on?"
   * 
   * 📍 Examples: 
   * - location.pathname = "/" (home page)
   * - location.pathname = "/notes" (notes app)
   * - location.pathname = "/crew" (crew app)
   */
  const location = useLocation();
  
  /**
   * CHECK WHICH MINI-APPS ARE ENABLED
   * 
   * These function calls check the current state of each feature flag.
   * Think of it like checking which light switches are currently ON in your house.
   * 
   * ✅ true = App is enabled, show navigation button
   * ❌ false = App is disabled, hide navigation button
   */
  const notesEnabled = useFeatureFlag('notesApp');        // 📝 Note-taking app
  const todoEnabled = useFeatureFlag('todoApp');          // ✅ Todo list app  
  const crewEnabled = useFeatureFlag('crew');             // 🚀 Crew generator app
  const snippetsEnabled = useFeatureFlag('codeSnippets'); // 💻 Code snippets app

  /**
   * DEFINE ALL POSSIBLE NAVIGATION ITEMS
   * 
   * This is like having a master list of all possible TV channels,
   * even if you don't subscribe to all of them yet.
   * 
   * 📋 Each item contains:
   * - label: What text appears on the button ("NOTES")
   * - path: Where clicking takes you ("/notes")  
   * - flagKey: Which feature flag controls this item ('notesApp')
   */
  const allNavItems: NavItem[] = [
    { label: 'NOTES', path: '/notes', flagKey: 'notesApp' },           // 📝 Always first when enabled
    { label: 'CREW', path: '/crew', flagKey: 'crew' },                // 🚀 Crew generator
    { label: 'TODOS', path: '/todos', flagKey: 'todoApp' },           // ✅ Todo app
    { label: 'SNIPPETS', path: '/snippets', flagKey: 'codeSnippets' }, // 💻 Code snippets
  ];

  /**
   * FILTER TO ONLY ENABLED NAVIGATION ITEMS
   * 
   * This is like filtering your TV channel list to only show channels you actually subscribe to.
   * We check each potential navigation item against its corresponding feature flag.
   * 
   * 🔍 Process: For each nav item, check if its feature flag is enabled
   * ✅ Enabled = Include in navigation bar
   * ❌ Disabled = Hide from navigation bar
   */
  const enabledNavItems = allNavItems.filter(item => {
    switch (item.flagKey) {
      case 'notesApp': return notesEnabled;      // Show NOTES button if notesApp flag is ON
      case 'crew': return crewEnabled;           // Show CREW button if crew flag is ON
      case 'todoApp': return todoEnabled;        // Show TODOS button if todoApp flag is ON
      case 'codeSnippets': return snippetsEnabled; // Show SNIPPETS button if codeSnippets flag is ON
      default: return false;                     // Unknown flags = don't show
    }
  });

  /**
   * DETECT IF USER IS ON A PORTFOLIO PAGE
   * 
   * Portfolio pages are the main website content (vs. mini-apps).
   * We need to know this to highlight the "PORTFOLIO" button when appropriate.
   * 
   * 🏠 Portfolio pages include:
   * - "/" (home page)
   * - "/work" (portfolio showcase)
   * - "/about" (about page)
   * - "/consulting" (services page)
   * - "/style-guide" (design documentation)
   * - "/project/*" (individual project pages)
   */
  const portfolioPages = ['/', '/work', '/about', '/consulting', '/style-guide'];
  const isOnPortfolio = portfolioPages.includes(location.pathname) || location.pathname.startsWith('/project/');

  /**
   * DECIDE WHETHER TO SHOW NAVIGATION BAR
   * 
   * The navigation bar only appears when at least one mini-app is enabled.
   * If no mini-apps are available, there's no point showing a navigation bar.
   * 
   * 🎯 Logic: "Only show the remote control if there are channels to surf"
   */
  const hasEnabledApps = enabledNavItems.length > 0;
  
  // Early return: If no apps are enabled, don't render anything
  if (!hasEnabledApps) {
    return null; // This means "render nothing" - the navigation disappears
  }

  /**
   * RENDER THE NAVIGATION BAR
   * 
   * This creates the visual navigation bar with all its styling and interactions.
   * Think of it like building a sophisticated TV remote control with:
   * - A nice blue background (like the remote's case)
   * - Buttons that light up when pressed (current page highlighting)
   * - Hover effects for better user experience
   * - Responsive design that works on all screen sizes
   */
  return (
    <nav style={{
      // 🎨 NAVIGATION BAR CONTAINER STYLES
      background: '#0C1D55',    // Deep blue background color
      padding: '12px 0',        // Vertical spacing (top and bottom)
      position: 'sticky',       // Stays at top when scrolling  
      top: 0,                   // Sticks to the very top
      zIndex: 100,              // Appears above other content (high layer)
    }}>
      <div style={{
        // 📐 CONTENT CONTAINER STYLES
        maxWidth: '1200px',      // Maximum width before content stops growing
        margin: '0 auto',        // Centers the content horizontally
        padding: '0 20px',       // Horizontal spacing (left and right)
        display: 'flex',         // Arranges children in a horizontal row
        alignItems: 'center',    // Vertically centers all navigation items
        gap: '24px',             // Space between each navigation item
      }}>
        
        {/* 
          🏷️ "APPS |" LABEL
          
          This is the text label that appears on the left side of the navigation.
          It helps users understand this navigation is for mini-apps (vs. main site).
          
          🎨 Styling notes:
          - Semi-transparent white (70% opacity) for subtle appearance
          - Monospace font for technical/modern feel
          - Uppercase with letter spacing for professional look
        */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',     // Semi-transparent white
          fontSize: '14px',                      // Slightly smaller than nav buttons
          fontWeight: '400',                     // Normal font weight (not bold)
          textTransform: 'uppercase',            // ALL CAPS
          letterSpacing: '1px',                  // Slight spacing between letters
          fontFamily: 'IBM Plex Mono, monospace', // Monospace font for tech feel
        }}>
          APPS |  {/* The pipe "|" acts as a visual separator */}
        </div>

        {/* 
          🏠 PORTFOLIO BUTTON
          
          This button takes users back to the main website (portfolio pages).
          It's always visible in the navigation as a "home base" option.
          
          🎯 Interactive behaviors:
          - Highlights when user is on any portfolio page
          - Hover effect for better user experience
          - Smooth transitions for professional feel
        */}
        <Link
          to="/"  // Takes user to the home page
          style={{
            // 🎨 BASE BUTTON STYLES
            color: 'white',                    // White text color
            textDecoration: 'none',            // No underline (removes default link styling)
            fontSize: '14px',                  // Standard button text size
            fontWeight: '400',                 // Normal font weight
            padding: '8px 16px',               // Inner spacing (vertical horizontal)
            borderRadius: '6px',               // Rounded corners
            
            // 🔦 HIGHLIGHTING LOGIC
            // If user is on a portfolio page, show darker background
            background: isOnPortfolio ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            
            // ✨ ANIMATION SETTINGS
            transition: 'all 0.2s ease',       // Smooth transitions for hover effects
            fontFamily: 'IBM Plex Mono, monospace', // Consistent font with label
            textTransform: 'uppercase',        // ALL CAPS for consistency
            letterSpacing: '1px',              // Letter spacing for modern look
          }}
          
          // 🖱️ HOVER EFFECTS
          // When mouse enters button area
          onMouseOver={(e) => {
            // Only show hover effect if this page isn't currently active
            if (!isOnPortfolio) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          // When mouse leaves button area  
          onMouseOut={(e) => {
            // Remove hover effect if this page isn't currently active
            if (!isOnPortfolio) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          PORTFOLIO
        </Link>

        {/* 
          🎮 MINI-APP NAVIGATION BUTTONS
          
          This section creates a button for each enabled mini-app.
          It's like having a separate button for each channel you subscribe to.
          
          🔄 Dynamic behavior:
          - Only shows buttons for apps that are currently enabled
          - Highlights the current app if you're viewing it
          - Each button has hover effects and smooth transitions
          
          💡 The .map() function creates one button for each item in enabledNavItems
        */}
        {enabledNavItems.map((item) => {
          // Check if this button represents the current page
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}  // React needs unique keys for list items
              to={item.path}   // Where this button navigates to
              style={{
                // 🎨 IDENTICAL STYLING TO PORTFOLIO BUTTON
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '400', 
                padding: '8px 16px',
                borderRadius: '6px',
                
                // 🔦 HIGHLIGHTING LOGIC
                // If this is the current page, show darker background
                background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                
                // ✨ CONSISTENT ANIMATION AND TYPOGRAPHY
                transition: 'all 0.2s ease',
                fontFamily: 'IBM Plex Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              
              // 🖱️ IDENTICAL HOVER EFFECTS TO PORTFOLIO BUTTON
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.label}  {/* Display the button text (e.g., "NOTES", "CREW") */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AppNavigation;
