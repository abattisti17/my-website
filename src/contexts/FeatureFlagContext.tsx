import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FeatureFlagConfig, FeatureFlagKey, FeatureFlagContextType } from '../types/featureFlags';
import { defaultFeatureFlags, getEnvironmentOverrides } from '../config/featureFlags';

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

const STORAGE_KEY = 'alessandro-website-feature-flags';

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlagConfig>(() => {
    // Initialize flags with: defaults + environment overrides + local storage overrides
    const envOverrides = getEnvironmentOverrides();
    
    // Try to load from local storage
    let localOverrides: Partial<FeatureFlagConfig> = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localOverrides = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load feature flags from localStorage:', error);
    }
    
    return {
      ...defaultFeatureFlags,
      ...envOverrides,
      ...localOverrides,
    };
  });

  // Save to localStorage whenever flags change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch (error) {
      console.warn('Failed to save feature flags to localStorage:', error);
    }
  }, [flags]);

  const isEnabled = (flag: FeatureFlagKey): boolean => {
    return flags[flag];
  };

  const enableFlag = (flag: FeatureFlagKey): void => {
    setFlags(prev => ({ ...prev, [flag]: true }));
  };

  const disableFlag = (flag: FeatureFlagKey): void => {
    setFlags(prev => ({ ...prev, [flag]: false }));
  };

  const toggleFlag = (flag: FeatureFlagKey): void => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const value: FeatureFlagContextType = {
    flags,
    isEnabled,
    enableFlag,
    disableFlag,
    toggleFlag,
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};
