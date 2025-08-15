import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface NavItem {
  label: string;
  path: string;
  emoji: string;
  flagKey: string;
}

const AppNavigation: React.FC = () => {
  const location = useLocation();
  
  // Check which mini-apps are enabled
  const notesEnabled = useFeatureFlag('notesApp');
  const todoEnabled = useFeatureFlag('todoApp');
  const budgetEnabled = useFeatureFlag('budgetTracker');
  const snippetsEnabled = useFeatureFlag('codeSnippets');

  // Define all possible navigation items
  const allNavItems: NavItem[] = [
    { label: 'Notes', path: '/notes', emoji: '📝', flagKey: 'notesApp' },
    { label: 'Todos', path: '/todos', emoji: '✅', flagKey: 'todoApp' },
    { label: 'Budget', path: '/budget', emoji: '💰', flagKey: 'budgetTracker' },
    { label: 'Snippets', path: '/snippets', emoji: '💻', flagKey: 'codeSnippets' },
  ];

  // Filter to only show enabled apps
  const enabledNavItems = allNavItems.filter(item => {
    switch (item.flagKey) {
      case 'notesApp': return notesEnabled;
      case 'todoApp': return todoEnabled;
      case 'budgetTracker': return budgetEnabled;
      case 'codeSnippets': return snippetsEnabled;
      default: return false;
    }
  });

  // Don't render if no apps are enabled
  if (enabledNavItems.length === 0) {
    return null;
  }

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Apps Label */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Apps
        </div>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}>
          {enabledNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: isActive 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  border: isActive 
                    ? '1px solid rgba(255, 255, 255, 0.3)'
                    : '1px solid transparent',
                  fontFamily: 'system-ui, sans-serif',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Optional: Portfolio link to go back to main site */}
        <div style={{ marginLeft: 'auto' }}>
          <Link
            to="/"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s ease',
              fontFamily: 'system-ui, sans-serif',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ← Portfolio
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AppNavigation;
