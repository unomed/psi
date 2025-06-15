
import React from 'react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-2">
      {title && (
        <div className="px-3 mb-1 mt-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
}
