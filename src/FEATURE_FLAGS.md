# Feature Flags System

This website uses a flexible feature flag system to enable/disable experimental features and mini-apps.

## Quick Start

1. **Enable Debug Mode**: Set `REACT_APP_FF_DEBUG_MODE=true` in your `.env.local` file
2. **Start your dev server**: `npm start`
3. **Use the Debug Panel**: A floating panel will appear in the top-right corner where you can toggle flags

## Available Feature Flags

### Mini Apps
- `notesApp` - A simple notes app with local storage
- `crewGenerator` - Crew generator application for managing teams
- `crew` - Core crew management functionality
- `todoApp` - Todo list application (not implemented yet)
- `budgetTracker` - Budget tracking app (not implemented yet) 
- `codeSnippets` - Code snippet manager (not implemented yet)

### Development
- `debugMode` - Shows the feature flag debug panel
- `performanceMetrics` - Display performance metrics (not implemented yet)

### UI Experiments
- `newNavigation` - Alternative navigation design (not implemented yet)
- `darkMode` - Dark theme (not implemented yet)
- `animationsEnabled` - Enable/disable animations

### Database
- `localStorageEnabled` - Enable localStorage for persistence
- `indexedDbEnabled` - Enable IndexedDB (not implemented yet)
- `firebaseEnabled` - Enable Firebase integration (not implemented yet)

## Usage Methods

### 1. Environment Variables (Build Time)
Add to your `.env.local` file:
```bash
REACT_APP_FF_NOTES_APP=true
REACT_APP_FF_CREW=true
REACT_APP_FF_DEBUG_MODE=true
```

### 2. Runtime Toggle (Debug Panel)
Enable debug mode and use the floating panel to toggle flags in real-time.

### 3. Programmatic Usage
```tsx
import { useFeatureFlag } from './hooks/useFeatureFlag';

const MyComponent = () => {
  const notesEnabled = useFeatureFlag('notesApp');
  const crewEnabled = useFeatureFlag('crew');
  
  return (
    <div>
      {notesEnabled && <NotesApp />}
      {crewEnabled && <CrewManagement />}
    </div>
  );
};
```

## Implementation Details

- **Persistence**: Flags set via the debug panel persist in localStorage
- **Priority**: localStorage overrides environment variables, which override defaults
- **Type Safety**: All flags are strongly typed in TypeScript
- **Hot Reloading**: Flag changes take effect immediately without page refresh

## Examples

Try these flags to see the system in action:

1. Set `REACT_APP_FF_DEBUG_MODE=true` to see the debug panel
2. Set `REACT_APP_FF_NOTES_APP=true` to enable the notes app at `/notes`
3. Use the debug panel to experiment with different combinations

## Adding New Flags

1. Add the flag to `FeatureFlagConfig` in `src/types/featureFlags.ts`
2. Set a default value in `src/config/featureFlags.ts`
3. Add environment variable parsing if needed
4. Use the flag with `useFeatureFlag('yourNewFlag')`
