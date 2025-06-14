
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import type { MenuItem } from './types';

interface SidebarMenuItemProps {
  item: MenuItem;
}

export function SidebarMenuItem({ item }: SidebarMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  const handleNavigation = () => {
    console.log(`[SidebarMenuItem] Navegando para: ${item.path}`);
  };

  if (item.subItems && item.subItems.length > 0) {
    return (
      <Collapsible asChild defaultOpen={item.subItems.some(subItem => location.pathname === subItem.path)}>
        <BaseSidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.path}>
                  <SidebarMenuSubButton asChild isActive={location.pathname === subItem.path}>
                    <Link to={subItem.path} onClick={handleNavigation}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </BaseSidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <BaseSidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <Link to={item.path} onClick={handleNavigation}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}
