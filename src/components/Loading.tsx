import React from 'react';

interface SpinnerProps {
  /** Spinner size */
  size?: 'small' | 'medium' | 'large';
  /** Custom color */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

interface SkeletonProps {
  /** Skeleton variant */
  variant?: 'text' | 'rectangular' | 'circular' | 'image';
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Number of lines for text skeleton */
  lines?: number;
  /** Additional CSS classes */
  className?: string;
}

interface LoadingPageProps {
  /** Loading message */
  message?: string;
}

/**
 * Spinner component for loading states
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'var(--color-primary)',
  className = ''
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return '16px';
      case 'large':
        return '32px';
      default:
        return '24px';
    }
  };

  const spinnerSize = getSize();

  return (
    <div 
      className={`spinner ${className}`}
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
      aria-label="Loading"
      role="status"
    />
  );
};

/**
 * Skeleton component for loading placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  lines = 1,
  className = ''
}) => {
  const getHeight = () => {
    if (height) return height;
    
    switch (variant) {
      case 'text':
        return '1.2em';
      case 'circular':
        return width;
      case 'image':
        return '200px';
      default:
        return '1.2em';
    }
  };

  const getBorderRadius = () => {
    switch (variant) {
      case 'circular':
        return '50%';
      case 'text':
        return '4px';
      default:
        return '4px';
    }
  };

  const skeletonStyle = {
    width,
    height: getHeight(),
    backgroundColor: 'var(--color-surface)',
    borderRadius: getBorderRadius(),
    animation: 'skeleton-pulse 1.5s ease-in-out infinite alternate'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`skeleton-container ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="skeleton skeleton-text"
            style={{
              ...skeletonStyle,
              width: index === lines - 1 ? '75%' : '100%',
              marginBottom: index < lines - 1 ? '8px' : '0'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`}
      style={skeletonStyle}
      aria-label="Loading content"
    />
  );
};

/**
 * Full page loading component
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Loading..."
}) => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <Spinner size="large" />
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

/**
 * Skeleton for page layout
 */
export const PageSkeleton: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <Skeleton variant="rectangular" height="300px" className="page-image-skeleton" />
        </div>
        
        <div className="page-header">
          <Skeleton variant="text" width="60%" height="42px" />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Skeleton variant="text" lines={3} />
          </div>
        </div>
        
        <div style={{ marginTop: 'var(--space-8)' }}>
          <Skeleton variant="text" lines={5} />
        </div>
      </div>
    </div>
  );
};
