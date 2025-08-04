
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarMenuItemWithSubmenu } from "./sidebar/SidebarMenuItemWithSubmenu";
import { MenuItemGuard } from "./sidebar/MenuItemGuard";
import { menuItems } from "./sidebar/menuItems";
import { settingsItems } from "./sidebar/settingsItems";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";

export function AppSidebar() {
  const { userRole } = useAuth();
  const { selectedCompanyId, selectedCompanyName } = useCompany();

  console.log('[AppSidebar] Current context:', {
    userRole,
    selectedCompanyId,
    selectedCompanyName
  });

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <CustomSidebarHeader />
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto px-3 py-4">
        {/* Lista flat moderna - todos os itens em uma única lista */}
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => (
            <MenuItemGuard 
              key={item.href} 
              allowedRoles={item.roles} 
              requiredPermission={item.permission}
            >
              <SidebarMenuItem item={item} />
            </MenuItemGuard>
          ))}
          
          {/* Configurações como item expandível - APENAS SUPERADMIN */}
          {userRole === 'superadmin' && (
            <div className="mt-8 pt-4 border-t border-sidebar-border">
              <SidebarMenuItemWithSubmenu
                title="Configurações"
                items={settingsItems.map(item => ({
                  title: item.title,
                  href: item.url,
                  icon: item.icon,
                  roles: ["superadmin"]
                }))}
                icon={undefined}
              />
            </div>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
