import React, { useState, useEffect } from 'react';

interface BasicModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}

export function BasicModal({ trigger, children, title }: BasicModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug: Check window width
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      console.log('Window width:', window.innerWidth, 'Should show drawer:', window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>
    );
  }

  const isMobile = windowWidth < 768;
  console.log('BasicModal render:', { windowWidth, isMobile, isOpen });

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black z-[100]"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer/Modal Content */}
      <div className={`fixed z-[110] ${isMobile ? 'inset-x-0 bottom-0' : 'inset-0 flex items-center justify-center'}`}>
        <div 
          className={`bg-white w-full animate-slide-up ${isMobile ? 'rounded-t-xl' : 'rounded-xl max-w-lg mx-auto relative'}`}
          style={{ 
            backgroundColor: 'white',
            minHeight: isMobile ? '50vh' : 'auto',
            maxHeight: isMobile ? '90vh' : '80vh',
            boxShadow: isMobile 
              ? '0 -10px 25px -5px rgba(0, 0, 0, 0.2), 0 -4px 6px -2px rgba(0, 0, 0, 0.1)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle for mobile */}
          {isMobile && (
            <div 
              className="w-16 h-1.5 bg-gray-400 rounded-full mx-auto mt-4 mb-6 cursor-grab active:cursor-grabbing hover:bg-gray-500 transition-colors"
              onClick={() => setIsOpen(false)}
              title="Tap to close"
            />
          )}
          
          {/* Content with proper padding */}
          <div className={isMobile ? 'px-6 pb-6' : 'p-6'}>
            {/* Close button for desktop */}
            {!isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              >
                ✕
              </button>
            )}
            
            {/* Title */}
            {title && (
              <h2 className="text-xl font-semibold mb-4 pr-8">{title}</h2>
            )}
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
