/**
 * FEATURE FLAG HOOKS
 * 
 * This file contains custom React hooks that make it super easy to work with feature flags.
 * Think of these like convenient remote controls for your feature flag system.
 * 
 * 🎯 Purpose:
 * - Provide simple, one-line ways to check feature flags
 * - Abstract away the complexity of the feature flag system
 * - Ensure type safety when working with flag names
 * - Make code more readable and maintainable
 * 
 * 📦 Contains two hooks:
 * 1. useFeatureFlag - Just check if a flag is on/off
 * 2. useFeatureFlagToggle - Check status AND get a toggle function
 * 
 * 💡 Think of it like: The simple buttons on your TV remote vs. the full settings menu
 */

import { useFeatureFlags } from '../contexts/FeatureFlagContext';  // Access to global flag system
import { FeatureFlagKey } from '../types/featureFlags';            // TypeScript types for flag names

/**
 * SIMPLE FEATURE FLAG CHECK HOOK
 * 
 * This is the most common way to check feature flags in components.
 * It's like asking a simple yes/no question: "Is this feature turned on?"
 * 
 * 🔍 Use this when you just need to know if a feature is enabled.
 * 
 * @param flag - The name of the feature flag to check (must be a valid FeatureFlagKey)
 * @returns boolean - true if the flag is enabled, false if disabled
 * 
 * 💡 Example usage:
 * ```typescript
 * const crewEnabled = useFeatureFlag('crew');
 * if (crewEnabled) {
 *   return <CrewGenerator />;
 * }
 * return <ComingSoon />;
 * ```
 * 
 * 🎯 Benefits:
 * - One line of code to check any feature flag
 * - TypeScript prevents typos in flag names
 * - Automatically re-renders when flag changes
 * - Clean, readable code
 */
export const useFeatureFlag = (flag: FeatureFlagKey): boolean => {
  // Connect to the global feature flag system
  const { isEnabled } = useFeatureFlags();
  
  // Return whether this specific flag is currently enabled
  return isEnabled(flag);
};

/**
 * FEATURE FLAG WITH TOGGLE HOOK
 * 
 * This hook gives you both the flag status AND a function to toggle it.
 * It's like getting both a light switch's current state and the ability to flip it.
 * 
 * 🔧 Use this in development/debug components where you need to change flags.
 * 
 * @param flag - The name of the feature flag to check and control
 * @returns object with:
 *   - isEnabled: boolean (current state of the flag)
 *   - toggle: function (call this to flip the flag on/off)
 * 
 * 💡 Example usage:
 * ```typescript
 * const { isEnabled, toggle } = useFeatureFlagToggle('crew');
 * 
 * return (
 *   <div>
 *     <span>Crew feature is {isEnabled ? 'ON' : 'OFF'}</span>
 *     <button onClick={toggle}>Toggle Crew</button>
 *   </div>
 * );
 * ```
 * 
 * 🎯 Perfect for:
 * - Debug panels and developer tools
 * - Testing different feature combinations
 * - Admin interfaces for feature management
 * - Real-time feature flag demonstrations
 */
export const useFeatureFlagToggle = (flag: FeatureFlagKey) => {
  // Connect to the global feature flag system
  const { isEnabled, toggleFlag } = useFeatureFlags();
  
  // Return both the current state and a toggle function
  return {
    isEnabled: isEnabled(flag),    // Current state of the flag
    toggle: () => toggleFlag(flag), // Function to flip the flag on/off
  };
};
