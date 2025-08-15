/**
 * Feature flag configuration types
 */

export interface FeatureFlagConfig {
  // Experimental mini-apps
  notesApp: boolean;
  todoApp: boolean;
  budgetTracker: boolean;
  codeSnippets: boolean;
  crewGenerator: boolean;
  
  // Development features
  debugMode: boolean;
  performanceMetrics: boolean;
  
  // UI experiments
  newNavigation: boolean;
  darkMode: boolean;
  animationsEnabled: boolean;
  
  // Database experiments
  localStorageEnabled: boolean;
  indexedDbEnabled: boolean;
  firebaseEnabled: boolean;
}

export type FeatureFlagKey = keyof FeatureFlagConfig;

export interface FeatureFlagContextType {
  flags: FeatureFlagConfig;
  isEnabled: (flag: FeatureFlagKey) => boolean;
  enableFlag: (flag: FeatureFlagKey) => void;
  disableFlag: (flag: FeatureFlagKey) => void;
  toggleFlag: (flag: FeatureFlagKey) => void;
}
