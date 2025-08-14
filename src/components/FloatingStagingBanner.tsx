import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Position {
  x: number;
  y: number;
}

const FloatingStagingBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 25, y: 0 }); // Start bottom-left
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  
  const bannerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });

  // Initialize position to bottom-left
  useEffect(() => {
    const updatePosition = () => {
      const windowHeight = window.innerHeight;
      const bannerHeight = bannerRef.current?.offsetHeight || 60;
      setPosition({ x: 25, y: windowHeight - bannerHeight - 25 });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Snap to nearest edge with spring physics
  const snapToEdge = useCallback((currentPos: Position) => {
    if (!bannerRef.current) return;

    const rect = bannerRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const centerX = currentPos.x + rect.width / 2;
    const centerY = currentPos.y + rect.height / 2;
    
    // Determine nearest edge
    const distanceToLeft = centerX;
    const distanceToRight = windowWidth - centerX;
    const distanceToTop = centerY;
    const distanceToBottom = windowHeight - centerY;
    
    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
    
    let newPos: Position;
    
    if (minDistance === distanceToLeft) {
      // Snap to left edge
      newPos = { x: 25, y: Math.max(25, Math.min(windowHeight - rect.height - 25, currentPos.y)) };
    } else if (minDistance === distanceToRight) {
      // Snap to right edge
      newPos = { x: windowWidth - rect.width - 25, y: Math.max(25, Math.min(windowHeight - rect.height - 25, currentPos.y)) };
    } else if (minDistance === distanceToTop) {
      // Snap to top edge
      newPos = { x: Math.max(25, Math.min(windowWidth - rect.width - 25, currentPos.x)), y: 25 };
    } else {
      // Snap to bottom edge
      newPos = { x: Math.max(25, Math.min(windowWidth - rect.width - 25, currentPos.x)), y: windowHeight - rect.height - 25 };
    }
    
    setIsAnimating(true);
    setPosition(newPos);
    
    // Reset animation flag after animation completes
    setTimeout(() => setIsAnimating(false), 500);
  }, []);

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!bannerRef.current) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = bannerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !bannerRef.current) return;
    
    e.preventDefault();
    
    // Slight lag/spring effect - interpolate between current and target position
    const targetX = e.clientX - dragOffset.x;
    const targetY = e.clientY - dragOffset.y;
    
    setPosition(prev => ({
      x: prev.x + (targetX - prev.x) * 0.8, // 80% interpolation for slight lag
      y: prev.y + (targetY - prev.y) * 0.8
    }));
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Only snap to edge if we actually dragged (not just clicked)
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - dragStartRef.current.x, 2) + 
      Math.pow(e.clientY - dragStartRef.current.y, 2)
    );
    
    if (dragDistance > 5) {
      snapToEdge(position);
    }
  }, [isDragging, position, snapToEdge]);

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const collapsedSize = 50;
  const expandedWidth = Math.min(320, window.innerWidth - 50); // Responsive width
  const expandedHeight = 80;

  return (
    <div
      ref={bannerRef}
      className="floating-staging-banner"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isExpanded ? `${expandedWidth}px` : `${collapsedSize}px`,
        height: isExpanded ? `${expandedHeight}px` : `${collapsedSize}px`,
        backgroundColor: '#4CAF50',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 9999,
        transition: isAnimating 
          ? 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
          : 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'hidden',
        border: '2px solid #45a049',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Collapsed State */}
      {!isExpanded && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
          onClick={handleToggleExpanded}
        >
          🔧
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {/* Wrench Icon */}
          <span style={{ fontSize: '20px', marginRight: '12px' }}>🔧</span>
          
          {/* Text */}
          <span style={{ flex: 1, fontSize: '13px' }}>
            Staging - not a live site
          </span>
          
          {/* Style Guide Button */}
          <Link
            to="/style-guide"
            style={{
              backgroundColor: 'white',
              color: '#4CAF50',
              padding: '6px 12px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '600',
              marginRight: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Style Guide
          </Link>
          
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpanded();
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingStagingBanner;
