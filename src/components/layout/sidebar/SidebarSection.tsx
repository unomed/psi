
import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <SidebarGroup className="px-3 py-2">
      {title && (
        <SidebarGroupLabel className="px-2 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent className="space-y-1">
        {children}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
