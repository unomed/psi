
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function MobileOptimizedLayout({
  children,
  header,
  footer,
  sidebar,
  className
}: MobileOptimizedLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col lg:flex-row', className)}>
      {/* Sidebar - hidden on mobile, shown on desktop */}
      {sidebar && (
        <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 bg-sidebar border-r border-border">
          {sidebar}
        </aside>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        {header && (
          <header className="flex-shrink-0 bg-background border-b border-border">
            {header}
          </header>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        {footer && (
          <footer className="flex-shrink-0 bg-background border-t border-border">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
