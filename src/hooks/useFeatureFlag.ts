import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import { FeatureFlagKey } from '../types/featureFlags';

/**
 * Simple hook to check if a feature flag is enabled
 * @param flag The feature flag key to check
 * @returns boolean indicating if the flag is enabled
 */
export const useFeatureFlag = (flag: FeatureFlagKey): boolean => {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flag);
};

/**
 * Hook that returns both the flag status and toggle function
 * Useful for development/debugging toggles
 */
export const useFeatureFlagToggle = (flag: FeatureFlagKey) => {
  const { isEnabled, toggleFlag } = useFeatureFlags();
  
  return {
    isEnabled: isEnabled(flag),
    toggle: () => toggleFlag(flag),
  };
};
