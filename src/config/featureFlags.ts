import { FeatureFlagConfig } from '../types/featureFlags';

/**
 * Default feature flag configuration
 * You can override these with environment variables or local storage
 */
export const defaultFeatureFlags: FeatureFlagConfig = {
  // Experimental mini-apps - start with these disabled
  notesApp: false,
  todoApp: false,
  budgetTracker: false,
  codeSnippets: false,
  
  // Development features
  debugMode: process.env.NODE_ENV === 'development',
  performanceMetrics: false,
  
  // UI experiments
  newNavigation: false,
  darkMode: false,
  animationsEnabled: true,
  
  // Database experiments
  localStorageEnabled: true,
  indexedDbEnabled: false,
  firebaseEnabled: false,
};

/**
 * Environment variable overrides
 * Use REACT_APP_FF_[FLAG_NAME] to override flags
 * Example: REACT_APP_FF_NOTES_APP=true
 */
export const getEnvironmentOverrides = (): Partial<FeatureFlagConfig> => {
  const overrides: Partial<FeatureFlagConfig> = {};
  
  // Helper to parse boolean from env var
  const parseBool = (value: string | undefined): boolean | undefined => {
    if (value === undefined) return undefined;
    return value.toLowerCase() === 'true';
  };
  
  // Check for environment overrides
  const envOverrides = {
    notesApp: parseBool(process.env.REACT_APP_FF_NOTES_APP),
    todoApp: parseBool(process.env.REACT_APP_FF_TODO_APP),
    budgetTracker: parseBool(process.env.REACT_APP_FF_BUDGET_TRACKER),
    codeSnippets: parseBool(process.env.REACT_APP_FF_CODE_SNIPPETS),
    debugMode: parseBool(process.env.REACT_APP_FF_DEBUG_MODE),
    performanceMetrics: parseBool(process.env.REACT_APP_FF_PERFORMANCE_METRICS),
    newNavigation: parseBool(process.env.REACT_APP_FF_NEW_NAVIGATION),
    darkMode: parseBool(process.env.REACT_APP_FF_DARK_MODE),
    animationsEnabled: parseBool(process.env.REACT_APP_FF_ANIMATIONS_ENABLED),
    localStorageEnabled: parseBool(process.env.REACT_APP_FF_LOCAL_STORAGE_ENABLED),
    indexedDbEnabled: parseBool(process.env.REACT_APP_FF_INDEXED_DB_ENABLED),
    firebaseEnabled: parseBool(process.env.REACT_APP_FF_FIREBASE_ENABLED),
  };
  
  // Only include defined values
  Object.entries(envOverrides).forEach(([key, value]) => {
    if (value !== undefined) {
      overrides[key as keyof FeatureFlagConfig] = value;
    }
  });
  
  return overrides;
};
