import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import './ionic-button.css';

/**
 * IonicButton - Ionic-powered button with design system compatibility
 * 
 * This component wraps Ionic's IonButton to provide the same API as our existing
 * Button component while gaining mobile-native benefits like touch feedback,
 * accessibility, and platform-optimized styling.
 * 
 * Features:
 * - Same API as existing Button (variant, size, fullWidth props)
 * - Maps to design tokens from design-tokens.css
 * - Mobile-optimized touch targets and feedback
 * - Built-in accessibility features
 * - Consistent cross-platform styling (mode="md")
 * - Icon support with proper positioning
 * 
 * @example
 * <IonicButton variant="default" size="lg" fullWidth>
 *   Create Event
 * </IonicButton>
 * 
 * @example
 * <IonicButton variant="outline" icon={add} iconPosition="start">
 *   Add Item
 * </IonicButton>
 */

const ionicButtonVariants = cva(
  "ionic-button-base",
  {
    variants: {
      variant: {
        default: "ionic-button-default",
        destructive: "ionic-button-destructive", 
        outline: "ionic-button-outline",
        ghost: "ionic-button-ghost",
      },
      size: {
        sm: "ionic-button-sm",
        md: "ionic-button-md", 
        lg: "ionic-button-lg",
        default: "ionic-button-default-size",
      },
      fullWidth: {
        true: "ionic-button-full-width",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IonicButtonProps extends VariantProps<typeof ionicButtonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: string;
  iconPosition?: 'start' | 'end';
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean; // For compatibility with existing Button API
}

export function IonicButton({
  children,
  variant = "default",
  size = "default", 
  fullWidth = false,
  className,
  icon,
  iconPosition = 'start',
  disabled = false,
  type = 'button',
  onClick,
  asChild = false,
  ...props
}: IonicButtonProps) {
  // Map variants to Ionic's fill prop
  const getFill = () => {
    switch (variant) {
      case 'outline':
        return 'outline';
      case 'ghost':
        return 'clear';
      default:
        return 'solid';
    }
  };

  // Map size to Ionic's size prop (optional, we handle sizing via CSS)
  const getIonicSize = () => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'large';
      default:
        return 'default';
    }
  };

  return (
    <IonButton
      fill={getFill()}
      size={getIonicSize()}
      expand={fullWidth ? 'block' : undefined}
      mode="md" // Consistent Material Design styling across platforms
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn(ionicButtonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {icon && iconPosition === 'start' && <IonIcon icon={icon} slot="start" />}
      {children}
      {icon && iconPosition === 'end' && <IonIcon icon={icon} slot="end" />}
    </IonButton>
  );
}
