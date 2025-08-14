import React, { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * ResponsiveImage component with intelligent loading and error handling
 * Based on modern web development best practices for image optimization
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes,
  fallbackSrc,
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setImageError(false);
    } else {
      onError?.();
    }
  };

  // Generate srcSet for common breakpoints if we're dealing with a relative path
  const generateSrcSet = (baseSrc: string): string | undefined => {
    if (!baseSrc.startsWith('/') || baseSrc.includes('http')) {
      return undefined;
    }
    
    // For now, just return undefined - this could be extended to generate
    // multiple image sizes if you implement a build-time image optimization system
    return undefined;
  };

  const srcSet = generateSrcSet(imageSrc);

  return (
    <img
      src={imageSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={`responsive-image ${className} ${imageLoaded ? 'loaded' : 'loading'} ${imageError ? 'error' : ''}`}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      decoding="async"
      // Remove redundant role attribute as img elements have implicit img role
      // Prevent dragging for better UX
      draggable={false}
    />
  );
};

export default ResponsiveImage;
