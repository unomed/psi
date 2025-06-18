
import React from 'react';
import { SidebarSection } from './SidebarSection';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarMenuItemWithSubmenu } from './SidebarMenuItemWithSubmenu';
import { MenuItemGuard } from './MenuItemGuard';
import { SidebarMenu } from '@/components/ui/sidebar';
import { 
  dashboardItem, 
  cadastrosItems, 
  avaliacoesItems, 
  gestaoItems,
  portaisItems
} from './menuItems';
import { settingsItems } from './settingsItems';
import { useAuth } from '@/contexts/AuthContext';

export function SafeSidebarContent() {
  const { userRole } = useAuth();

  console.log('[SafeSidebarContent] Current user role:', userRole);

  return (
    <div className="overflow-y-auto">
      {/* Dashboard */}
      <SidebarSection title="">
        <SidebarMenu className="space-y-1">
          <MenuItemGuard allowedRoles={dashboardItem.roles} requiredPermission={dashboardItem.permission}>
            <SidebarMenuItem key={dashboardItem.href} item={dashboardItem} />
          </MenuItemGuard>
        </SidebarMenu>
      </SidebarSection>

      {/* CADASTROS */}
      <SidebarSection title="CADASTROS">
        <SidebarMenu className="space-y-1">
          {cadastrosItems.map((item) => (
            <MenuItemGuard 
              key={item.href} 
              allowedRoles={item.roles} 
              requiredPermission={item.permission}
            >
              <SidebarMenuItem item={item} />
            </MenuItemGuard>
          ))}
        </SidebarMenu>
      </SidebarSection>

      {/* AVALIAÇÕES */}
      <SidebarSection title="AVALIAÇÕES">
        <SidebarMenu className="space-y-1">
          {avaliacoesItems.map((item) => (
            <MenuItemGuard 
              key={item.href} 
              allowedRoles={item.roles} 
              requiredPermission={item.permission}
            >
              <SidebarMenuItem item={item} />
            </MenuItemGuard>
          ))}
        </SidebarMenu>
      </SidebarSection>

      {/* GESTÃO */}
      <SidebarSection title="GESTÃO">
        <SidebarMenu className="space-y-1">
          {gestaoItems.map((item) => (
            <MenuItemGuard 
              key={item.href} 
              allowedRoles={item.roles} 
              requiredPermission={item.permission}
            >
              <SidebarMenuItem item={item} />
            </MenuItemGuard>
          ))}
        </SidebarMenu>
      </SidebarSection>

      {/* PORTAIS */}
      <SidebarSection title="PORTAIS">
        <SidebarMenu className="space-y-1">
          {portaisItems.map((item) => (
            <MenuItemGuard 
              key={item.href} 
              allowedRoles={item.roles} 
              requiredPermission={item.permission}
            >
              <SidebarMenuItem item={item} />
            </MenuItemGuard>
          ))}
        </SidebarMenu>
      </SidebarSection>

      {/* CONFIGURAÇÕES */}
      <div className="mt-6 pt-6 border-t border-sidebar-border">
        <div className="px-3 py-2">
          <h3 className="px-2 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
            Configurações
          </h3>
          <div className="space-y-1">
            {settingsItems.map((item) => (
              <MenuItemGuard 
                key={item.url} 
                allowedRoles={["admin", "superadmin"]}
              >
                <div className="px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                  <a href={item.url} className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </a>
                </div>
              </MenuItemGuard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
