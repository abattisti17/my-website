# 🤖 AI Assistant Instructions

## Repository Structure

This repository contains **TWO separate applications**:

1. **Portfolio Website** (root directory) - Alessandro's personal website
2. **Crew Generator** (`/crew-generator/`) - PWA for concert crews ← **MAIN DEVELOPMENT FOCUS**

## 🚨 CRITICAL: Directory Context

**When working on the Crew Generator app**, you MUST run all commands from the `/crew-generator` directory:

```bash
# ✅ CORRECT - Always use this pattern
cd /Users/battist/Documents/GitHub/my-website/crew-generator
npm run dev

# ❌ WRONG - This will fail
cd /Users/battist/Documents/GitHub/my-website  
npm run dev  # No dev script exists here
```

## Common Commands

### Development Server
```bash
cd /Users/battist/Documents/GitHub/my-website/crew-generator
npm run dev                    # Starts Vite on localhost:5173
```

### Build & Deploy
```bash
cd /Users/battist/Documents/GitHub/my-website/crew-generator
npm run build                  # Production build
npm run preview               # Preview production build
```

### Package Management
```bash
cd /Users/battist/Documents/GitHub/my-website/crew-generator
npm install                   # Install dependencies
npm install <package-name>    # Add new dependency
```

### Git Operations
```bash
# Git commands can be run from either directory (they operate on the whole repo)
cd /Users/battist/Documents/GitHub/my-website
git add .
git commit -m "message"
git push
```

## File Paths

When editing files, use full paths from the repository root:

```typescript
// ✅ CORRECT - Full path
/Users/battist/Documents/GitHub/my-website/crew-generator/src/components/Button.tsx

// ❌ CONFUSING - Relative path might be ambiguous  
src/components/Button.tsx
```

## Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components  
- **Backend**: Supabase (Auth + Database + Realtime + Storage)
- **State**: React hooks + Context API
- **Build**: Vite with code splitting and performance optimizations

## Key Architecture Decisions

1. **Design System**: Uses CSS `gap` with design tokens instead of Tailwind spacing utilities for better framework compatibility
2. **Performance**: React.memo, useMemo, useCallback optimizations implemented
3. **Error Handling**: Error boundaries and retry logic for network requests
4. **Development**: Enhanced logging and debugging utilities in dev mode

## Memory Tips

Remember these user preferences:
- No manual server management (prefer solutions that don't interrupt AI conversations)
- Granular control over decisions (present options with pros/cons)
- Global design system for consistent styling across the app
