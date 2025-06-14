
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import type { MenuItem } from './types';

interface SidebarMenuItemProps {
  item: MenuItem;
}

export function SidebarMenuItem({ item }: SidebarMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.path || location.pathname === item.href;

  const handleNavigation = () => {
    console.log(`[SidebarMenuItem] Navegando para: ${item.path || item.href}`);
  };

  return (
    <BaseSidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={item.path || item.href} onClick={handleNavigation}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}

// Simple sub-item component for settings menu
export function SidebarMenuSubItemComponent({ 
  title, 
  href, 
  isActive 
}: { 
  title: string; 
  href: string; 
  isActive: boolean; 
}) {
  return (
    <div className={`ml-6 py-1 px-2 rounded text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
      <Link to={href} className="block">
        {title}
      </Link>
    </div>
  );
}
