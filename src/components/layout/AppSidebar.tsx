
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarSection } from "./sidebar/SidebarSection";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarMenuItemWithSubmenu } from "./sidebar/SidebarMenuItemWithSubmenu";
import { MenuItemGuard } from "./sidebar/MenuItemGuard";
import { 
  dashboardItem, 
  cadastrosItems, 
  avaliacoesItems, 
  gestaoItems,
  candidatosItems,
  portaisItems
} from "./sidebar/menuItems";
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
      
      <SidebarContent className="overflow-y-auto">
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

        {/* CANDIDATOS */}
        <SidebarSection title="CANDIDATOS">
          <SidebarMenu className="space-y-1">
            {candidatosItems.map((item) => (
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
          <SidebarMenuItemWithSubmenu
            title="Configurações"
            items={settingsItems.map(item => ({
              title: item.title,
              href: item.url,
              icon: item.icon,
              roles: ["admin", "superadmin"]
            }))}
            icon={undefined}
          />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
