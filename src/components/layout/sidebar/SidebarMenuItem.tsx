
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
        className={`
          w-full px-4 py-3 transition-all duration-200 rounded-lg
          relative group
          ${isActive 
            ? 'bg-sidebar-active-bg text-sidebar-active-text font-semibold shadow-sm border-l-4 border-sidebar-active-border' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.02]'
          }
          ${isSubItem ? 'ml-6 text-sm py-2' : 'text-sm'}
        `}
      >
        {item.isExternal ? (
          <button 
            onClick={handleNavigation} 
            className="flex items-center gap-3 w-full text-left"
          >
            {item.icon && (
              <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                isActive ? 'text-sidebar-active-text' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'
              }`} />
            )}
            <span className="font-medium truncate flex-1">{item.title}</span>
            <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-60" />
          </button>
        ) : (
          <Link 
            to={item.href} 
            onClick={handleNavigation}
            className="flex items-center gap-3 w-full"
          >
            {item.icon && (
              <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                isActive ? 'text-sidebar-active-text' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'
              }`} />
            )}
            <span className="font-medium truncate flex-1">{item.title}</span>
            {isActive && (
              <div className="w-2 h-2 bg-sidebar-active-border rounded-full flex-shrink-0 animate-pulse" />
            )}
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
    <div className={`
      ml-8 py-2 px-3 rounded-lg text-sm transition-all duration-200 
      relative group
      ${isActive 
        ? 'bg-sidebar-active-bg text-sidebar-active-text font-semibold border-l-3 border-sidebar-active-border' 
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01]'
      }
    `}>
      <Link to={href} className="flex items-center w-full">
        <span className="flex-1">{title}</span>
        {isActive && (
          <div className="w-1.5 h-1.5 bg-sidebar-active-border rounded-full animate-pulse" />
        )}
      </Link>
    </div>
  );
}
