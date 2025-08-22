'use client';

import { Drawer } from 'vaul';

interface SimpleDrawerProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SimpleDrawer({ trigger, children, open, onOpenChange }: SimpleDrawerProps) {
  console.log('SimpleDrawer render:', { open, hasOnOpenChange: !!onOpenChange });
  
  return (
    <Drawer.Root 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log('Drawer.Root onOpenChange:', newOpen);
        onOpenChange?.(newOpen);
      }}
    >
      <Drawer.Trigger asChild onClick={() => console.log('Drawer.Trigger clicked!')}>
        {trigger}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay 
          className="fixed inset-0 bg-black/40 z-40" 
          onClick={() => console.log('Overlay clicked!')}
        />
        <Drawer.Content 
          className="bg-white h-fit fixed bottom-0 left-0 right-0 outline-none rounded-t-xl"
          style={{ 
            minHeight: '400px',
            border: '5px solid red',
            zIndex: '9999',
            transform: 'translateY(0)', // Force no transform
            backgroundColor: 'lime', // Super visible
            boxShadow: '0 0 50px red'
          }}
        >
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-2 w-16 rounded-full bg-gray-300" />
          
          {/* Content */}
          <div className="p-6 pb-8">
            <div style={{ background: 'yellow', padding: '10px' }}>
              <h3>🟡 TEST: Simple Drawer Content</h3>
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
