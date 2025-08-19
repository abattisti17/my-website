import { FeatureFlagConfig } from '../types/featureFlags';

/**
 * FEATURE FLAGS - DEFAULT CONFIGURATION
 * 
 * This is like the "factory settings" for your website's features.
 * When someone visits your website for the first time, these are the 
 * settings they'll see.
 * 
 * 🎚️ Think of it like: When you buy a new TV, some channels are already 
 *    programmed in - these are your "default channels"
 * 
 * 🔄 These can be overridden by:
 *    1. Environment variables (different settings for dev/staging/production)  
 *    2. Local storage (user's browser remembers their custom settings)
 *    3. The debug panel (instant on/off switches)
 */
export const defaultFeatureFlags: FeatureFlagConfig = {
  // 🎮 EXPERIMENTAL MINI-APPS
  // Control which mini-applications are available by default
  notesApp: true,           // ✅ ON - Note-taking app is stable and ready
  crew: false,              // ❌ OFF - Crew generator is new, testing in dev first  
  todoApp: false,           // ❌ OFF - Todo app not built yet
  budgetTracker: true,      // ✅ ON - Legacy flag, currently hijacked for crew generator
  codeSnippets: false,      // ❌ OFF - Code snippets feature not built yet
  
  // 🛠️ DEVELOPMENT FEATURES
  // Tools for testing and debugging - usually ON in development
  debugMode: true,          // ✅ ON - Show the floating debug panel for testing
  performanceMetrics: false, // ❌ OFF - Performance monitoring not implemented yet
  
  // 🎨 UI EXPERIMENTS  
  // Visual and interaction improvements being tested
  newNavigation: false,     // ❌ OFF - Alternative navigation not ready yet
  darkMode: false,          // ❌ OFF - Dark theme not implemented yet  
  animationsEnabled: true,  // ✅ ON - CSS animations enhance user experience
  
  // 💾 DATABASE EXPERIMENTS
  // Different ways to store user data and preferences
  localStorageEnabled: true,  // ✅ ON - Browser storage works well for notes/settings
  indexedDbEnabled: false,    // ❌ OFF - Advanced browser storage not needed yet
  firebaseEnabled: false,     // ❌ OFF - Cloud storage not implemented yet
};

/**
 * ENVIRONMENT VARIABLE OVERRIDES
 * 
 * This function allows you to control feature flags using environment variables.
 * Think of environment variables like "mood settings" for different occasions:
 * 
 * 🏠 Local development: "Relaxed mode" - everything enabled for testing
 * 🎭 Staging: "Preview mode" - some features enabled for client review  
 * 🚀 Production: "Professional mode" - only stable features enabled
 * 
 * 📝 Usage Examples:
 *    REACT_APP_FF_CREW=true        (Turn crew feature ON)
 *    REACT_APP_FF_DEBUG_MODE=false (Turn debug panel OFF)
 * 
 * 🔧 How it works: Environment variables override the default settings above
 */
export const getEnvironmentOverrides = (): Partial<FeatureFlagConfig> => {
  // Create an empty object to store any environment variable overrides
  const overrides: Partial<FeatureFlagConfig> = {};
  
  /**
   * Helper function to convert text to boolean
   * 
   * Environment variables come as text (strings), but we need true/false values.
   * This function converts "true" → true, "false" → false, anything else → undefined
   * 
   * 💡 Example: parseBool("true") returns true
   *            parseBool("false") returns false  
   *            parseBool("maybe") returns undefined (ignored)
   */
  const parseBool = (value: string | undefined): boolean | undefined => {
    if (value === undefined) return undefined;
    return value.toLowerCase() === 'true';
  };
  
  /**
   * Check for environment variable overrides
   * 
   * This object maps each feature flag to its corresponding environment variable.
   * The naming pattern is: REACT_APP_FF_[FLAG_NAME]
   * 
   * 🔍 Example: crew flag looks for REACT_APP_FF_CREW environment variable
   */
  const envOverrides = {
    // Mini-app environment controls
    notesApp: parseBool(process.env.REACT_APP_FF_NOTES_APP),
    crew: parseBool(process.env.REACT_APP_FF_CREW),
    todoApp: parseBool(process.env.REACT_APP_FF_TODO_APP),
    budgetTracker: parseBool(process.env.REACT_APP_FF_BUDGET_TRACKER),
    codeSnippets: parseBool(process.env.REACT_APP_FF_CODE_SNIPPETS),
    
    // Development feature controls  
    debugMode: parseBool(process.env.REACT_APP_FF_DEBUG_MODE),
    performanceMetrics: parseBool(process.env.REACT_APP_FF_PERFORMANCE_METRICS),
    
    // UI experiment controls
    newNavigation: parseBool(process.env.REACT_APP_FF_NEW_NAVIGATION),
    darkMode: parseBool(process.env.REACT_APP_FF_DARK_MODE),
    animationsEnabled: parseBool(process.env.REACT_APP_FF_ANIMATIONS_ENABLED),
    
    // Database experiment controls
    localStorageEnabled: parseBool(process.env.REACT_APP_FF_LOCAL_STORAGE_ENABLED),
    indexedDbEnabled: parseBool(process.env.REACT_APP_FF_INDEXED_DB_ENABLED),
    firebaseEnabled: parseBool(process.env.REACT_APP_FF_FIREBASE_ENABLED),
  };
  
  /**
   * Filter out undefined values and build final overrides object
   * 
   * We only want to override flags that were explicitly set in environment variables.
   * If someone didn't set REACT_APP_FF_CREW, we don't want to change the crew flag.
   * 
   * 🎯 This loop: "Only change settings that were specifically requested"
   */
  Object.entries(envOverrides).forEach(([key, value]) => {
    if (value !== undefined) {
      overrides[key as keyof FeatureFlagConfig] = value;
    }
  });
  
  return overrides;
};
