
import { useMemo, useCallback } from "react";
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
  const { userRole } = useAuth();
  const { hasPermission, loadingPermission } = useCheckPermission();

  // Memoize filtered menu items to prevent unnecessary recalculations
  const filteredMenuItems = useMemo(() => {
    if (loadingPermission || !userRole) return [];

    return menuItems.filter(item => {
      // Always allow dashboard access for authenticated users
      if (item.permission === 'view_dashboard') {
        return true;
      }

      // Check if user role exists and item has roles array
      if (!item.roles || !Array.isArray(item.roles)) {
        return false;
      }
      
      // Check if user role is included in item roles
      const hasRole = item.roles.includes(userRole);
      
      // If no role match, deny access
      if (!hasRole) {
        return false;
      }
      
      // Check permission if item has a permission property
      const hasPermissionCheck = item.permission ? hasPermission(item.permission) : true;
      
      console.log(`Menu item ${item.title}: hasRole=${hasRole}, hasPermission=${hasPermissionCheck}`);
      
      return hasPermissionCheck;
    });
  }, [userRole, hasPermission, loadingPermission]);

  // Memoize the settings submenu to prevent unnecessary re-renders
  const settingsSubmenu = useMemo(() => (
    <SettingsSubmenu userRole={userRole} />
  ), [userRole]);

  // Show loading state while permissions are being fetched
  if (loadingPermission) {
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

  console.log(`Filtered menu items for role ${userRole}:`, filteredMenuItems.map(item => item.title));

  return (
    <Sidebar className="border-r">
      <SidebarHeader />
      
      <SidebarContent className="flex flex-col h-[calc(100%-60px)]">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <MenuItem
                    title={item.title}
                    icon={item.icon}
                    path={item.href || item.path}
                  />
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                {settingsSubmenu}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
