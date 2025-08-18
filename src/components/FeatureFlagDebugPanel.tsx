/**
 * FEATURE FLAG DEBUG PANEL COMPONENT
 * 
 * This is the floating control panel that appears on staging and development sites.
 * Think of it like a "control room" or "mission control" for your website features.
 * 
 * 🎯 Purpose:
 * - Let developers instantly turn features on/off without code changes
 * - Test different feature combinations quickly
 * - Show which features are working vs. placeholders
 * - Provide real-time preview of changes (no page refresh needed)
 * 
 * 🎨 Visual Design:
 * - Floating panel on the right side of screen
 * - Organized into categories (Mini Apps, Development, UI, Database)
 * - Color-coded status indicators (🟢 working, 🟡 placeholder)
 * - Toggle switches for instant on/off control
 * 
 * 🔧 Technical Features:
 * - Saves settings to browser localStorage (persists across sessions)
 * - Real-time updates (changes take effect immediately)
 * - Responsive design (adapts to different screen sizes)
 * - Keyboard accessible (can be operated without mouse)
 * 
 * 💡 Think of it like: The soundboard at a concert - lots of sliders and 
 *    buttons that let you control different aspects of the performance in real-time
 */

import React from 'react';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';  // Hook to access and modify feature flags
import { FeatureFlagKey } from '../types/featureFlags';            // TypeScript type for flag names

/**
 * Main FeatureFlagDebugPanel Component Function
 * 
 * This function creates the interactive debug panel with all its functionality.
 * It's like building a sophisticated control dashboard with multiple sections.
 */
const FeatureFlagDebugPanel: React.FC = () => {
  /**
   * ACCESS FEATURE FLAG SYSTEM
   * 
   * This connects to the global feature flag system to:
   * - Get current state of all flags (flags object)
   * - Get function to toggle flags on/off (toggleFlag function)
   * 
   * 🔌 Think of it like: Plugging into the electrical system to control all the lights
   */
  const { flags, toggleFlag } = useFeatureFlags();
  
  /**
   * INFORMATION PANEL STATE
   * 
   * Controls whether the detailed information panel is visible.
   * When true, shows descriptions and status for each feature flag.
   * When false, shows only the toggle switches.
   * 
   * 📖 Think of it like: A "more details" button that expands explanations
   */
  const [showInfo, setShowInfo] = React.useState(false);

  /**
   * FEATURE FLAG ORGANIZATION
   * 
   * This object organizes all feature flags into logical categories.
   * It's like organizing your remote control buttons into groups:
   * - Channel buttons, Volume buttons, Power buttons, etc.
   * 
   * 📂 Categories:
   * - Mini Apps: The different applications users can access
   * - Development: Tools for developers and testing
   * - UI Experiments: Visual and interaction changes being tested
   * - Database: Different ways to store and retrieve data
   * 
   * 💡 Each category contains an array of flag names (FeatureFlagKey[])
   */
  const flagCategories = {
    'Mini Apps': ['notesApp', 'crew', 'todoApp', 'budgetTracker', 'codeSnippets'] as FeatureFlagKey[],
    'Development': ['debugMode', 'performanceMetrics'] as FeatureFlagKey[],
    'UI Experiments': ['newNavigation', 'darkMode', 'animationsEnabled'] as FeatureFlagKey[],
    'Database': ['localStorageEnabled', 'indexedDbEnabled', 'firebaseEnabled'] as FeatureFlagKey[],
  };

  /**
   * UTILITY FUNCTION: Format Flag Names for Display
   * 
   * Converts camelCase flag names into readable titles.
   * This makes the debug panel more user-friendly.
   * 
   * 🔄 Examples:
   * - 'notesApp' → 'Notes App'
   * - 'debugMode' → 'Debug Mode'  
   * - 'localStorageEnabled' → 'Local Storage Enabled'
   * 
   * 🎯 How it works:
   * 1. Find capital letters in the middle of words
   * 2. Add spaces before them
   * 3. Capitalize the first letter
   */
  const formatFlagName = (flag: string): string => {
    return flag.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const flagDescriptions: Record<FeatureFlagKey, { description: string; status: 'working' | 'placeholder' }> = {
    // Mini Apps
    notesApp: { description: 'A full-featured notes app with local storage. Creates and manages text notes with CRUD operations.', status: 'working' },
    crew: { description: 'Core crew management functionality and features - Travel Crew Generator to find your concert crew and make memories together', status: 'working' },
    todoApp: { description: 'Todo list application with task management (not implemented yet)', status: 'placeholder' },
    budgetTracker: { description: 'Budget tracking app (legacy, replaced by crew functionality)', status: 'placeholder' },
    codeSnippets: { description: 'Code snippet manager with syntax highlighting (not implemented yet)', status: 'placeholder' },
    
    // Development
    debugMode: { description: 'Shows development tools and debug information. Auto-enabled in development mode.', status: 'working' },
    performanceMetrics: { description: 'Display performance metrics and timing information (not implemented yet)', status: 'placeholder' },
    
    // UI Experiments
    newNavigation: { description: 'Alternative navigation design and layout (not implemented yet)', status: 'placeholder' },
    darkMode: { description: 'Dark theme for the entire website (not implemented yet)', status: 'placeholder' },
    animationsEnabled: { description: 'Controls CSS animations and transitions across the site', status: 'working' },
    
    // Database
    localStorageEnabled: { description: 'Enables localStorage for data persistence. Used by notes app and other features.', status: 'working' },
    indexedDbEnabled: { description: 'Enables IndexedDB for more complex data storage (not implemented yet)', status: 'placeholder' },
    firebaseEnabled: { description: 'Enables Firebase integration for cloud storage and real-time features (not implemented yet)', status: 'placeholder' },
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '10px',
      zIndex: 1000,
      fontFamily: 'monospace',
    }}>
      {/* Info Panel - appears to the left when showInfo is true */}
      {showInfo && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          fontSize: '14px',
          width: '320px',
          maxHeight: '500px',
          overflowY: 'auto',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ margin: '0', fontSize: '16px', color: 'white' }}>📖 Flag Info</h3>
            <button
              onClick={() => setShowInfo(false)}
              style={{
                background: 'transparent',
                border: '1px solid #666',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = '#999';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#666';
              }}
              title="Close info panel"
            >
              ✕
            </button>
          </div>
          
          <div style={{ marginBottom: '12px', fontSize: '11px', lineHeight: '1.4' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#fff' }}>Status Legend:</div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#22c55e' }}>●</span> <strong>Working:</strong> Feature is implemented
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#ef4444' }}>●</span> <strong>Placeholder:</strong> Coming soon
            </div>
          </div>
          
          {Object.entries(flagCategories).map(([category, categoryFlags]) => (
            <div key={category} style={{ marginBottom: '12px' }}>
              <div style={{ 
                fontSize: '10px', 
                color: '#888', 
                textTransform: 'uppercase',
                marginBottom: '6px',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}>
                {category}
              </div>
              {categoryFlags.map(flag => {
                const info = flagDescriptions[flag];
                return (
                  <div key={flag} style={{ marginBottom: '8px', fontSize: '11px', lineHeight: '1.4' }}>
                    <div style={{ marginBottom: '2px' }}>
                      <span style={{ 
                        color: info.status === 'working' ? '#22c55e' : '#ef4444',
                        marginRight: '6px'
                      }}>
                        ●
                      </span>
                      <strong style={{ color: 'white' }}>{formatFlagName(flag)}</strong>
                    </div>
                    <div style={{ 
                      color: '#ccc', 
                      marginLeft: '12px',
                      fontSize: '10px'
                    }}>
                      {info.description}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Main Feature Flag Panel */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '300px',
      }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: '0', fontSize: '16px', color: 'white' }}>🚩 Feature Flags</h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            background: 'transparent',
            border: '1px solid #666',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = '#999';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#666';
          }}
          title="Show flag descriptions"
        >
          ?
        </button>
      </div>
      
      {Object.entries(flagCategories).map(([category, categoryFlags]) => (
        <div key={category} style={{ marginBottom: '15px' }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '12px', 
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {category}
          </h4>
          
          {categoryFlags.map(flag => (
            <div key={flag} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '5px',
              padding: '4px 8px',
              background: flags[flag] ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              borderRadius: '4px',
            }}>
              <span style={{ fontSize: '12px' }}>{formatFlagName(flag)}</span>
              <button
                onClick={() => toggleFlag(flag)}
                style={{
                  background: flags[flag] ? '#22c55e' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}
              >
                {flags[flag] ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      ))}
      
        <div style={{ 
          marginTop: '15px', 
          fontSize: '11px', 
          color: '#666',
          borderTop: '1px solid #333',
          paddingTop: '10px'
        }}>
          💡 Flags persist in localStorage
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagDebugPanel;
