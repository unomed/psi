
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

  return (
    <BaseSidebarMenuItem className="list-none">
      <SidebarMenuButton 
        className={`w-full px-3 py-2 transition-all duration-200 hover:bg-sidebar-accent/50 rounded-md ${
          isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm' 
            : 'text-sidebar-foreground'
        } ${isSubItem ? 'ml-4' : ''}`}
      >
        {item.isExternal ? (
          <button 
            onClick={handleNavigation} 
            className="flex items-center gap-3 w-full text-left"
          >
            {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
            <span className="font-medium truncate">{item.title}</span>
            <ExternalLink className="h-4 w-4 ml-auto flex-shrink-0" />
          </button>
        ) : (
          <Link 
            to={item.href} 
            onClick={handleNavigation}
            className="flex items-center gap-3 w-full"
          >
            {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
            <span className="font-medium truncate">{item.title}</span>
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
    <div className={`ml-6 py-2 px-3 rounded-md text-sm transition-all duration-200 ${
      isActive 
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm' 
        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
    }`}>
      <Link to={href} className="block w-full">
        {title}
      </Link>
    </div>
  );
}
