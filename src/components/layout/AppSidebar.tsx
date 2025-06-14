
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SettingsSubmenu } from "./sidebar/SettingsSubmenu";
import { menuItems } from "./sidebar/menuItems";

export function AppSidebar() {
  const { userRole } = useAuth();
  const { hasPermission, loadingPermission } = useCheckPermission();

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

  const filteredMenuItems = menuItems.filter(item => {
    // Check if user role exists and item has roles array
    if (!userRole || !item.roles || !Array.isArray(item.roles)) {
      return false;
    }
    
    // Check if user role is included in item roles
    const hasRole = item.roles.includes(userRole);
    
    // Check permission if item has a permission property
    const hasPermissionCheck = item.permission ? hasPermission(item.permission) : true;
    
    console.log(`Menu item ${item.title}: hasRole=${hasRole}, hasPermission=${hasPermissionCheck}`);
    
    return hasRole && hasPermissionCheck;
  });

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
                <SidebarMenuItem
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  path={item.href || item.path}
                />
              ))}
              
              <SettingsSubmenu userRole={userRole} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
