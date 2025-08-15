import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface NavItem {
  label: string;
  path: string;
  flagKey: string;
}

const AppNavigation: React.FC = () => {
  const location = useLocation();
  
  // Check which mini-apps are enabled
  const notesEnabled = useFeatureFlag('notesApp');
  const todoEnabled = useFeatureFlag('todoApp');
  const budgetEnabled = useFeatureFlag('budgetTracker');
  const snippetsEnabled = useFeatureFlag('codeSnippets');
  const crewGeneratorEnabled = useFeatureFlag('crewGenerator');

  // Define all possible navigation items (notes first, then others)
  const allNavItems: NavItem[] = [
    { label: 'NOTES', path: '/notes', flagKey: 'notesApp' },
    { label: 'CREW', path: '/crew', flagKey: 'crewGenerator' },
    { label: 'TODOS', path: '/todos', flagKey: 'todoApp' },
    { label: 'BUDGET', path: '/budget', flagKey: 'budgetTracker' },
    { label: 'SNIPPETS', path: '/snippets', flagKey: 'codeSnippets' },
  ];

  // Filter to only show enabled apps
  const enabledNavItems = allNavItems.filter(item => {
    switch (item.flagKey) {
      case 'notesApp': return notesEnabled;
      case 'crewGenerator': return crewGeneratorEnabled;
      case 'todoApp': return todoEnabled;
      case 'budgetTracker': return budgetEnabled;
      case 'codeSnippets': return snippetsEnabled;
      default: return false;
    }
  });

  // Check if we're on a portfolio page (main site)
  const portfolioPages = ['/', '/work', '/about', '/consulting', '/style-guide'];
  const isOnPortfolio = portfolioPages.includes(location.pathname) || location.pathname.startsWith('/project/');

  // Only show navigation in staging environment
  const isStaging = process.env.REACT_APP_ENVIRONMENT === 'staging';
  
  if (!isStaging) {
    return null;
  }

  return (
    <nav style={{
      background: '#0C1D55',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Apps Label with separator */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          APPS |
        </div>

        {/* Portfolio Link */}
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '400',
            padding: '8px 16px',
            borderRadius: '6px',
            background: isOnPortfolio ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            transition: 'all 0.2s ease',
            fontFamily: 'IBM Plex Mono, monospace',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
          onMouseOver={(e) => {
            if (!isOnPortfolio) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseOut={(e) => {
            if (!isOnPortfolio) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          PORTFOLIO
        </Link>

        {/* Navigation Items for enabled apps */}
        {enabledNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '400',
                padding: '8px 16px',
                borderRadius: '6px',
                background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                transition: 'all 0.2s ease',
                fontFamily: 'IBM Plex Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AppNavigation;
