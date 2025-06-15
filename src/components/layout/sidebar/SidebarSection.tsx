
import React from 'react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-6">
      {title && (
        <div className="px-3 mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
