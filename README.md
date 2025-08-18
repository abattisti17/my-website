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

```
alessandro-website/
├── public/
│   ├── index.html
│   └── icons/          # Original favicon and icons
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/         # Page components
│   ├── data/          # Project data and types
│   ├── assets/        # Images and static assets
│   ├── App.tsx        # Main app component with routing
│   └── index.tsx      # React entry point
├── package.json       # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
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