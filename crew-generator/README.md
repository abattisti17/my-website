# 🎵 Travel Crew Generator

A mobile-first PWA for building and managing concert crews. Built with React + TypeScript + Vite + Supabase.

## 🤖 For AI Assistants

**⚠️ CRITICAL**: When working on this project, ALWAYS run commands from the `/crew-generator` directory, NOT the repository root.

```bash
# ❌ WRONG - Running from repository root
cd /Users/battist/Documents/GitHub/my-website
npm run dev  # This will fail - no dev script here

# ✅ CORRECT - Running from crew-generator directory  
cd /Users/battist/Documents/GitHub/my-website/crew-generator
npm run dev  # This starts Vite dev server on localhost:5173
```

**Directory Context**: This project is located at `/crew-generator/` within a larger repository that also contains Alessandro's portfolio website.

## 🎨 Design System

This project uses a **design token-first architecture** for consistent, maintainable UI components:

- **[📖 Complete Architecture Guide](./DESIGN_SYSTEM_ARCHITECTURE.md)** - Comprehensive system documentation
- **[🚀 Quick Reference](./DESIGN_SYSTEM_QUICK_REFERENCE.md)** - TL;DR for developers  
- **[🔄 Migration Guide](./MIGRATION_TO_DESIGN_TOKENS.md)** - How to migrate existing code
- **[🧩 Component Docs](./src/components/design-system/README.md)** - Usage examples

**Key Principle**: Never hardcode styles - always use design system components and tokens.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Known Issues & Solutions

### RLS Policy Recursion Issue

**Problem**: `event_members` table queries fail with "infinite recursion detected in policy"

**Temporary Fix**: EventPage.tsx currently skips `event_members` queries to prevent console errors.

**Permanent Solution**: Update Supabase RLS policies:

```sql
-- Drop existing problematic policies
DROP POLICY IF EXISTS "event_members_policy" ON event_members;

-- Create simpler, non-recursive policies
CREATE POLICY "Users can view event members for events they're in" 
ON event_members FOR SELECT
USING (
  event_id IN (
    SELECT event_id FROM event_members WHERE user_id = auth.uid()
  )
  OR 
  -- Allow viewing all members for public events
  event_id IN (SELECT id FROM events)
);

CREATE POLICY "Users can insert themselves as event members" 
ON event_members FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own membership" 
ON event_members FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own membership" 
ON event_members FOR DELETE
USING (user_id = auth.uid());
```

**To apply the fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the above SQL commands
3. Uncomment the `event_members` queries in `src/pages/EventPage.tsx`

### Invalid API Key Error

**Problem**: "Invalid API key" error during authentication

**Solution**: Update Supabase credentials in `.env.local`:
1. Go to Supabase Dashboard → Settings → API
2. Copy the current Project URL and anon/public key
3. Update `.env.local` with the new values
4. Restart the development server (`npm run dev`)

**Note**: API keys rarely change unless manually regenerated or project is recreated.

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Auth + Database + Realtime + Storage)
- **PWA**: Service Worker + Manifest for mobile app experience
- **Build**: Vite with optimizations for production

## 📁 Project Structure

```
crew-generator/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities (Supabase client)
│   ├── types/            # TypeScript definitions
│   └── main.tsx          # App entry point
├── public/               # Static assets
└── dist/                 # Production build
```

## 🎯 Features

- **Events**: Create and join music events
- **Pods**: Small groups within events (max 5 people)
- **Real-time Chat**: Live messaging within pods
- **Progressive Web App**: Install on mobile devices
- **Authentication**: Magic link email auth via Supabase
