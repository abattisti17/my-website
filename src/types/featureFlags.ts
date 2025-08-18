/**
 * FEATURE FLAGS SYSTEM - TYPE DEFINITIONS
 * 
 * This file defines the "blueprint" for all feature flags in the website.
 * Think of it like a blueprint for light switches in a house - it tells us 
 * what switches exist and what they can do.
 * 
 * 🎯 Purpose: Control which features are visible to users
 * 🔧 Usage: Used throughout the app to show/hide features
 * 📝 Example: if (crewEnabled) { showCrewFeature(); }
 */

/**
 * Main configuration object that defines ALL available feature flags
 * 
 * Each flag is a boolean (true/false) that controls whether a feature is active.
 * When you add a new feature to the website, you add its flag here first.
 * 
 * 🏗️ Categories explained:
 * - Mini-apps: Separate applications within the main website
 * - Development: Tools for testing and debugging  
 * - UI experiments: Visual changes and new designs
 * - Database: Different ways to store and retrieve data
 */
export interface FeatureFlagConfig {
  // 🎮 EXPERIMENTAL MINI-APPS
  // These are like separate "rooms" in your website house
  notesApp: boolean;        // Simple note-taking app with local storage
  todoApp: boolean;         // Task management app (not built yet)
  budgetTracker: boolean;   // Budget tracking app (legacy, being replaced)
  codeSnippets: boolean;    // Code snippet manager (not built yet)
  crew: boolean;            // Travel crew generator - main new feature!
  
  // 🛠️ DEVELOPMENT FEATURES  
  // Tools to help developers test and debug the website
  debugMode: boolean;           // Shows the floating feature flag panel
  performanceMetrics: boolean;  // Shows website speed statistics (not built yet)
  
  // 🎨 UI EXPERIMENTS
  // Visual changes and interface improvements being tested
  newNavigation: boolean;       // Alternative navigation design (not built yet)
  darkMode: boolean;           // Dark color scheme (not built yet)
  animationsEnabled: boolean;   // Controls CSS animations and transitions
  
  // 💾 DATABASE EXPERIMENTS
  // Different ways to save and load data
  localStorageEnabled: boolean;  // Save data in browser (works offline)
  indexedDbEnabled: boolean;     // Advanced browser storage (not built yet)
  firebaseEnabled: boolean;      // Cloud storage service (not built yet)
}

/**
 * Type helper that creates a list of all possible flag names
 * 
 * 🎯 Purpose: Ensures you can only use flag names that actually exist
 * 💡 Example: This prevents typos like 'crue' instead of 'crew'
 */
export type FeatureFlagKey = keyof FeatureFlagConfig;

/**
 * Interface for the feature flag system's main functions
 * 
 * This defines what actions you can perform with feature flags.
 * Think of it like the remote control for your TV - it lists all the buttons
 * available and what they do.
 */
export interface FeatureFlagContextType {
  flags: FeatureFlagConfig;                           // Current state of all flags
  isEnabled: (flag: FeatureFlagKey) => boolean;       // Check if a flag is ON
  enableFlag: (flag: FeatureFlagKey) => void;         // Turn a flag ON  
  disableFlag: (flag: FeatureFlagKey) => void;        // Turn a flag OFF
  toggleFlag: (flag: FeatureFlagKey) => void;         // Switch a flag (ON→OFF or OFF→ON)
}
