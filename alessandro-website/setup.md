# Setup Instructions

## Prerequisites

Before you can run this React version of Alessandro's website, you need to install Node.js.

### Installing Node.js

#### Option 1: Using Homebrew (Recommended)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

#### Option 2: Direct Download
Visit [nodejs.org](https://nodejs.org/) and download the LTS version.

#### Option 3: Using nvm (Node Version Manager)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal, then install Node.js
nvm install --lts
nvm use --lts
```

## Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd alessandro-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The website will automatically open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Troubleshooting

### Common Issues

1. **"command not found: npm"**
   - Node.js is not installed. Follow the installation steps above.

2. **"Module not found" errors**
   - Run `npm install` to install dependencies.

3. **Port 3000 already in use**
   - The development server will automatically suggest an alternative port.

4. **TypeScript errors**
   - These are expected if Node.js isn't installed. They'll resolve once you run `npm install`.

## Next Steps

Once the development server is running, you can:
- Edit files in the `src/` directory to modify the website
- Add new projects in `src/data/projects.ts`
- Customize styles in `src/index.css`
- Deploy to production using `npm run build`

## Deployment

To deploy the website:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `build/` folder** to your preferred hosting service:
   - Netlify: Drag and drop the `build/` folder
   - Vercel: Connect your GitHub repository
   - GitHub Pages: Use the `gh-pages` package
   - AWS S3: Upload the `build/` folder contents 