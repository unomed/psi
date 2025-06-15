
import React, { useState } from 'react';
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

  const hasActiveSubItem = items.some(item => location.pathname === item.href);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <BaseSidebarMenuItem className="list-none">
          <SidebarMenuButton className={`w-full justify-between ${hasActiveSubItem ? 'bg-accent text-accent-foreground' : ''}`}>
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              <span>{title}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </SidebarMenuButton>
        </BaseSidebarMenuItem>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="ml-6">
        <div className="space-y-0">
          {items.map((item) => (
            <BaseSidebarMenuItem key={item.href} className="list-none">
              <SidebarMenuButton 
                className={location.pathname === item.href ? 'bg-accent text-accent-foreground' : ''}
              >
                <Link to={item.href} className="flex items-center gap-2 w-full">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </BaseSidebarMenuItem>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
