
import React from 'react';
import { cn } from '@/lib/utils';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 100 
}: StaggerContainerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="animate-in fade-in slide-in-from-left-4 duration-300 fill-mode-both"
          style={{
            animationDelay: `${index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
