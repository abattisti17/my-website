import React from 'react';

interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'link' | 'nav' | 'project';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS classes */
  className?: string;
  /** Custom cursor class */
  cursorClass?: 'custom-cursor-work' | 'custom-cursor-about' | 'custom-cursor-consulting';
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Reusable Button component following the design system
 * Supports all the styling patterns used throughout the site
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  cursorClass,
  style
}) => {
  const getBaseClasses = () => {
    const baseClasses = [
      'button-component',
      disabled && 'button-disabled',
      loading && 'button-loading',
      cursorClass
    ].filter(Boolean).join(' ');
    
    return baseClasses;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'nav':
        return 'nav-link';
      case 'project':
        return 'project-link';
      case 'link':
        return 'link-text';
      case 'secondary':
        return 'button-secondary';
      default:
        return 'button-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'button-small';
      case 'large':
        return 'button-large';
      default:
        return 'button-medium';
    }
  };

  const buttonClasses = [
    getBaseClasses(),
    getVariantClasses(),
    getSizeClasses(),
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? (
        <span className="button-loading-content">
          <span className="button-spinner"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
