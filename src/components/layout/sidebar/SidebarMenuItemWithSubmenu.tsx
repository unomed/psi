
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { MenuItem } from './types';

interface SidebarMenuItemWithSubmenuProps {
  title: string;
  items: MenuItem[];
  icon?: React.ComponentType<any>;
}

export function SidebarMenuItemWithSubmenu({ 
  title, 
  items, 
  icon: Icon 
}: SidebarMenuItemWithSubmenuProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    // Abrir automaticamente se algum subitem estiver ativo
    return items.some(item => location.pathname === item.href);
  });

  // Manter aberto se navegar para um subitem
  useEffect(() => {
    const hasActiveSubItem = items.some(item => location.pathname === item.href);
    if (hasActiveSubItem && !isOpen) {
      setIsOpen(true);
    }
  }, [location.pathname, items, isOpen]);

  const hasActiveSubItem = items.some(item => location.pathname === item.href);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <BaseSidebarMenuItem className="list-none">
          <SidebarMenuButton 
            className={`w-full justify-between px-3 py-2 transition-all duration-200 rounded-md ${
              hasActiveSubItem 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-sidebar-primary' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="h-5 w-5" />}
              <span className="font-medium">{title}</span>
            </div>
            <div className="transition-transform duration-200">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </SidebarMenuButton>
        </BaseSidebarMenuItem>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="transition-all duration-200 ease-in-out">
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-sidebar-border pl-4">
          {items.map((item) => (
            <BaseSidebarMenuItem key={item.href} className="list-none">
              <SidebarMenuButton 
                className={`w-full px-3 py-2 transition-all duration-200 rounded-md ${
                  location.pathname === item.href 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm border-l-2 border-sidebar-primary' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Link to={item.href} className="flex items-center gap-3 w-full">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </BaseSidebarMenuItem>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
