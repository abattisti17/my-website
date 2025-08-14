# GitHub Actions CI/CD Setup

Your advanced CI/CD pipeline is now configured! Here's what you need to complete the setup:

## GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

### Production Secrets (you may already have some of these):
- `SFTP_HOST` - Your Electric Embers host (e.g., `your-username.electricembers.net`)
- `SFTP_USERNAME` - Your Electric Embers username
- `SFTP_PASSWORD` - Your Electric Embers password
- `SFTP_PATH` - Path to your production public_html (e.g., `/home/your-username/public_html/`)
- `PRODUCTION_DOMAIN` - Your production domain (for deployment notifications)

### Staging Secrets (new - for your staging subdomain):
- `STAGING_SFTP_HOST` - Your staging host (might be same as production)
- `STAGING_SFTP_USERNAME` - Your staging username
- `STAGING_SFTP_PATH` - Path to your staging directory (e.g., `/home/your-username/staging/`)
- `STAGING_DOMAIN` - Your staging subdomain

## How It Works

### 🧪 **Automated Testing**
Every push and PR runs:
- TypeScript compilation check
- ESLint code quality check
- Jest unit tests with coverage
- Production build verification

### 🚀 **Advanced Deployment**
- **Pull Request** → Deploys to staging for review
- **Merge to main** → Deploys to production
- **Deploys only if all tests pass**

### 🔄 **Workflow**
1. Create feature branch
2. Make changes
3. Open pull request → Auto-deploys to staging
4. Review on staging environment
5. Merge PR → Auto-deploys to production

## Next Steps

1. Add the missing secrets (especially staging ones)
2. Test by creating a pull request
3. Your local `deploy.sh` still works for manual deployments if needed

## Benefits You Now Have

✅ Professional-grade CI/CD pipeline  
✅ Automated testing prevents bugs  
✅ Staging environment for safe testing  
✅ Zero-downtime deployments  
✅ Automatic deployment notifications  
