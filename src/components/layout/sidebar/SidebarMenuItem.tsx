
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from '@/components/ui/sidebar';
import { ExternalLink } from 'lucide-react';
import type { MenuItem } from './types';

interface SidebarMenuItemProps {
  item: MenuItem;
  isSubItem?: boolean;
}

export function SidebarMenuItem({ item, isSubItem = false }: SidebarMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.href;

  const handleNavigation = () => {
    console.log(`[SidebarMenuItem] Navegando para: ${item.href}`);
    
    if (item.isExternal) {
      window.open(item.href, '_blank');
    }
  };

  const content = (
    <div className={`flex items-center gap-2 w-full ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'} ${isSubItem ? 'ml-4' : ''}`}>
      {item.icon && <item.icon />}
      <span>{item.title}</span>
      {item.isExternal && <ExternalLink className="h-3 w-3 ml-auto" />}
    </div>
  );

  return (
    <BaseSidebarMenuItem className="list-none">
      <SidebarMenuButton>
        {item.isExternal ? (
          <button onClick={handleNavigation} className="flex items-center gap-2 w-full text-left">
            {content}
          </button>
        ) : (
          <Link to={item.href} onClick={handleNavigation}>
            {content}
          </Link>
        )}
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
