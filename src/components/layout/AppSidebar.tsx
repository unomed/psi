
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
  // Adicionar proteção para garantir que o AuthContext está disponível
  let userRole: string | null = null;
  let hasPermission: (permission: string) => boolean = () => true; // Default allow para evitar logout
  let loadingPermission = false;

  try {
    const authContext = useAuth();
    userRole = authContext.userRole;
    const permissionContext = useCheckPermission();
    hasPermission = permissionContext.hasPermission;
    loadingPermission = permissionContext.loadingPermission;
  } catch (error) {
    console.warn("[AppSidebar] AuthContext não disponível:", error);
    // Retornar sidebar básico sem funcionalidades de auth
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

  // Memoize filtered menu items to prevent unnecessary recalculations
  const filteredMenuItems = useMemo(() => {
    if (loadingPermission) return [];

    return menuItems.filter(item => {
      try {
        // Always allow dashboard access for authenticated users
        if (item.permission === 'view_dashboard') {
          return true;
        }

        // Check if user role exists and item has roles array
        if (!item.roles || !Array.isArray(item.roles) || !userRole) {
          return false;
        }
        
        // Check if user role is included in item roles
        const hasRole = item.roles.includes(userRole);
        
        // If no role match, deny access
        if (!hasRole) {
          return false;
        }
        
        // Check permission if item has a permission property
        // Use try-catch to prevent permission errors from breaking the menu
        let hasPermissionCheck = true;
        if (item.permission) {
          try {
            hasPermissionCheck = hasPermission(item.permission);
          } catch (error) {
            console.warn(`[AppSidebar] Error checking permission ${item.permission}:`, error);
            // Default to allow access if permission check fails to prevent logout
            hasPermissionCheck = true;
          }
        }
        
        console.log(`Menu item ${item.title}: hasRole=${hasRole}, hasPermission=${hasPermissionCheck}`);
        
        return hasPermissionCheck;
      } catch (error) {
        console.warn(`[AppSidebar] Error processing menu item ${item.title}:`, error);
        // Default to allow access if there's an error to prevent logout
        return true;
      }
    });
  }, [userRole, hasPermission, loadingPermission]);

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
                    href={item.href}
                  />
                </SidebarMenuItem>
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
