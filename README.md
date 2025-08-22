# Alessandro Battisti's Website - React Version

A modern React rebuild of Alessandro Battisti's personal portfolio website, maintaining the original design aesthetic and content while modernizing the architecture.

## Features

- **Responsive Design**: Maintains the original warm, minimalist aesthetic
- **TypeScript**: Full type safety throughout the application
- **React Router**: Clean navigation between pages
- **Component-Based Architecture**: Reusable components for maintainability
- **Travel Crew Generator**: Standalone PWA app available at `/crew` endpoint
- **Original Content**: All original projects and content preserved
- **IBM Plex Typography**: Maintains the original font choices
- **Accessibility**: Proper semantic HTML and ARIA attributes

## Project Structure

⚠️ **IMPORTANT FOR AI ASSISTANTS**: This repository contains TWO separate applications:

1. **Main Portfolio** (`/`) - Alessandro's personal website
2. **Crew Generator** (`/crew-generator/`) - Standalone PWA application

### 🚨 Development Server Instructions

**When working on the Crew Generator app**, ALWAYS run the dev server from the `/crew-generator` directory:

```bash
# ❌ WRONG - Don't run from root
npm run dev  # This will fail - no dev script in root

# ✅ CORRECT - Run from crew-generator directory
cd crew-generator
npm run dev  # This starts the Vite dev server on localhost:5173
```

### Full Directory Structure

```
my-website/
├── alessandro-website/          # Legacy HTML version (archived)
├── crew-generator/             # 🎯 MAIN DEV FOCUS - PWA Application
│   ├── src/
│   │   ├── components/         # React components + design system
│   │   ├── pages/             # App pages/routes
│   │   ├── lib/               # Utilities, Supabase, dev helpers
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript definitions
│   ├── package.json           # Crew app dependencies & scripts
│   ├── vite.config.ts         # Vite build configuration
│   └── tailwind.config.js     # Tailwind CSS setup
├── src/                       # Personal portfolio React app
│   ├── components/            # Portfolio components
│   ├── pages/                 # Portfolio pages
│   └── assets/                # Images and static assets
├── package.json               # Portfolio dependencies
└── README.md                  # This file
```

## Pages

1. **Home** (`/`) - Personal introduction and contact information
2. **Work** (`/work`) - Overview of all projects
3. **Project Details** (`/project/:id`) - Individual project pages

## Projects Included

- **Nudge Project** - Behavioral change research for financial services
- **Dementia Workshop** - Participatory design with Elder Care Alliance
- **2-Sided Market Research** - Ethnographic research for marketplace platform
- **Crowdfunding Platform** - Revenue model research and UX design
- **Point-of-Sale MVP** - Strategy and market research

## Design System

- **Colors**: Warm palette (#FBF7E2 background, #2B1B00 text)
- **Typography**: IBM Plex Sans (body) and IBM Plex Serif (headings)
- **Layout**: Clean, content-focused design with subtle borders
- **Responsive**: Mobile-first design with breakpoints

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

## Development

The project uses:
- **React 18** with TypeScript
- **React Router v6** for navigation
- **CSS** for styling (maintaining original design)
- **Component-based architecture** for maintainability

## Original vs React Version

### Preserved Elements
- All original content and projects
- Design aesthetic and color palette
- Typography choices (IBM Plex fonts)
- Image assets and favicon
- Contact information and social links

### Improvements
- **Modern Architecture**: React with TypeScript
- **Better Navigation**: Client-side routing
- **Component Reusability**: Modular component structure
- **Type Safety**: Full TypeScript implementation
- **Maintainability**: Easier to update and extend
- **Performance**: Optimized React rendering

## Deployment

The build output can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## License

This is a personal portfolio website. All content belongs to Alessandro Battisti. 