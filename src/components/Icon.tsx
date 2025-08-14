import React from 'react';

interface IconProps {
  /** Icon name/type */
  name: 'back' | 'arrow-left' | 'arrow-right' | 'external-link' | 'close' | 'menu';
  /** Icon size */
  size?: 'small' | 'medium' | 'large' | number;
  /** Icon color - defaults to currentColor */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * Icon component for consistent SVG icon usage
 * Centralizes all icon definitions and provides consistent sizing
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  color = 'currentColor',
  className = '',
  alt
}) => {
  const getSize = () => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const iconSize = getSize();

  const getIconPath = () => {
    switch (name) {
      case 'back':
      case 'arrow-left':
        return (
          <path 
            d="M15 18l-6-6 6-6" 
            stroke={color} 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        );
      case 'arrow-right':
        return (
          <path 
            d="M9 18l6-6-6-6" 
            stroke={color} 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        );
      case 'external-link':
        return (
          <>
            <path 
              d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" 
              stroke={color} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M15 3h6v6M10 14L21 3" 
              stroke={color} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </>
        );
      case 'close':
        return (
          <>
            <path 
              d="M18 6L6 18M6 6l12 12" 
              stroke={color} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </>
        );
      case 'menu':
        return (
          <>
            <path 
              d="M3 12h18M3 6h18M3 18h18" 
              stroke={color} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </>
        );
      default:
        return null;
    }
  };

  // All icons are now inline SVGs for better performance and styling control

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      className={`icon icon-${name} ${className}`}
      aria-label={alt || name}
      role="img"
    >
      {getIconPath()}
    </svg>
  );
};

export default Icon;
