
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from '@/components/ui/sidebar';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface CollapsibleMenuItemProps {
  title: string;
  icon: LucideIcon;
  isActive: boolean;
  hasSubmenu?: boolean;
  children: React.ReactNode;
}

export function CollapsibleMenuItem({ 
  title, 
  icon: Icon, 
  isActive, 
  hasSubmenu = true,
  children 
}: CollapsibleMenuItemProps) {
  const location = useLocation();
  const isExpanded = isActive || location.pathname.startsWith('/configuracoes');

  return (
    <Collapsible asChild defaultOpen={isExpanded}>
      <BaseSidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Icon />
            <span>{title}</span>
            {hasSubmenu && (
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-1">
            {children}
          </div>
        </CollapsibleContent>
      </BaseSidebarMenuItem>
    </Collapsible>
  );
}
