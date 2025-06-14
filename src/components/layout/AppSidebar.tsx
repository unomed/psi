
import { useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem as MenuItem } from "./sidebar/SidebarMenuItem";
import { SettingsSubmenu } from "./sidebar/SettingsSubmenu";
import { menuItems } from "./sidebar/menuItems";

export function AppSidebar() {
  const { userRole, loading } = useAuth();
  const { hasPermission, loadingPermission } = useCheckPermission();

  console.log('[AppSidebar] Current user role:', userRole);
  console.log('[AppSidebar] Loading states:', { loading, loadingPermission });

  // Memoize filtered menu items
  const filteredMenuItems = useMemo(() => {
    if (loading || loadingPermission || !userRole) {
      console.log('[AppSidebar] Still loading, returning empty menu');
      return [];
    }

    return menuItems.filter(item => {
      try {
        // Check role access
        const hasRole = item.roles.includes(userRole);
        if (!hasRole) {
          console.log(`[AppSidebar] ${item.title}: Role check failed for ${userRole}`);
          return false;
        }

        // Check permission if specified
        if (item.permission) {
          const hasRequiredPermission = hasPermission(item.permission);
          console.log(`[AppSidebar] ${item.title}: Permission ${item.permission} = ${hasRequiredPermission}`);
          return hasRequiredPermission;
        }

        console.log(`[AppSidebar] ${item.title}: Access granted`);
        return true;
      } catch (error) {
        console.error(`[AppSidebar] Error checking access for ${item.title}:`, error);
        return false;
      }
    });
  }, [userRole, hasPermission, loading, loadingPermission]);

  // Show loading state
  if (loading || loadingPermission) {
    return (
      <Sidebar className="border-r">
        <SidebarHeader />
        <SidebarContent className="flex flex-col h-[calc(100%-60px)]">
          <SidebarGroup className="flex-1">
            <SidebarGroupLabel>Carregando...</SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  console.log('[AppSidebar] Filtered menu items:', filteredMenuItems.map(item => item.title));

  return (
    <Sidebar className="border-r">
      <SidebarHeader />
      
      <SidebarContent className="flex flex-col h-[calc(100%-60px)]">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <MenuItem
                  key={item.title}
                  item={item}
                />
              ))}
              
              <SidebarMenuItem>
                <SettingsSubmenu />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
