# Environment Configuration

## Required Environment Variables

### Development (.env.local)

**Quick Start:**
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials from Settings → API
3. Keep `VITE_PUBLIC_BASE_PATH=/` for development

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Base Path for Development
VITE_PUBLIC_BASE_PATH=/
```

### Staging
```env
# Supabase Configuration (same as dev)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Base Path for Staging Deployment
VITE_PUBLIC_BASE_PATH=/crew/
```

### Production
```env
# Supabase Configuration (same as dev/staging)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Base Path for Production Deployment
VITE_PUBLIC_BASE_PATH=/crew/
```

## GitHub Actions Secrets

### Required Secrets
Add these to your GitHub repository secrets (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### How Secrets Are Used

#### Staging Build
```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  VITE_PUBLIC_BASE_PATH: /crew/
```

#### Production Build
```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  VITE_PUBLIC_BASE_PATH: /crew/
```

## Getting Your Supabase Credentials

1. **Go to your Supabase Dashboard**
2. **Navigate to Settings → API**
3. **Copy the following:**
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

⚠️ **Security Note:** The anon key is safe to expose in client-side code. It's designed to be public and is protected by Row Level Security (RLS) policies.

## Runtime Verification

In development mode, the app will log configuration status to help with debugging:

```
🔧 Environment: development
📡 Supabase URL: https://your-project.supabase.co
📍 Base Path: /
✅ Configuration valid
```

## Troubleshooting

### "Invalid API key" Error
1. Check that `VITE_SUPABASE_ANON_KEY` matches your current Supabase project
2. API keys rarely change unless manually regenerated
3. Ensure no extra spaces or quotes in the `.env.local` file

### "Failed to load" Errors
1. Verify `VITE_SUPABASE_URL` is correct and accessible
2. Check that your Supabase project is active (not paused)

### Routing Issues (404s)
1. Ensure `VITE_PUBLIC_BASE_PATH` matches your deployment path
2. Development should use `/`, staging/production should use `/crew/`
3. Clear browser cache after changing base path

### GitHub Actions Deployment Failures
1. Verify all required secrets are set in GitHub
2. Check that secret names match exactly (case-sensitive)
3. Ensure no trailing spaces in secret values
