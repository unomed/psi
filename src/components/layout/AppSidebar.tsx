
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem as CustomSidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarMenuItemWithSubmenu } from "./sidebar/SidebarMenuItemWithSubmenu";
import { SidebarSection } from "./sidebar/SidebarSection";
import { EmployeePortalAccess } from "./sidebar/EmployeePortalAccess";
import { SettingsSubmenu } from "./sidebar/SettingsSubmenu";
import { menuItems } from "./sidebar/menuItems";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckPermission } from "@/hooks/useCheckPermission";

export function AppSidebar() {
  const { userRole } = useAuth();
  const { hasPermission } = useCheckPermission();

  const shouldShowMenuItem = (item: any) => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    return true;
  };

  const dashboardItems = menuItems.filter(item => item.href === "/dashboard");
  const cadastroItems = menuItems.filter(item => 
    ["/empresas", "/setores", "/funcoes", "/funcionarios"].includes(item.href)
  );
  const avaliacaoItems = menuItems.filter(item => 
    ["/checklists", "/agendamentos", "/resultados"].includes(item.href)
  );
  const gestaoItems = menuItems.filter(item => 
    ["/gestao-riscos", "/plano-acao", "/relatorios"].includes(item.href)
  );
  const portalItems = menuItems.filter(item => 
    item.href === "/employee-portal"
  );
  const faturamentoItems = menuItems.filter(item => 
    item.href === "/faturamento"
  );

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2 space-y-4">
        {/* Dashboard */}
        <SidebarSection title="">
          {dashboardItems.filter(shouldShowMenuItem).map((item) => (
            <CustomSidebarMenuItem key={item.href} item={item} />
          ))}
        </SidebarSection>

        {/* Cadastros com submenu */}
        {cadastroItems.some(shouldShowMenuItem) && (
          <SidebarSection title="">
            <div className="mb-2">
              <SidebarMenuItemWithSubmenu
                title="Cadastros"
                items={cadastroItems.filter(shouldShowMenuItem)}
                icon={cadastroItems[0]?.icon}
              />
            </div>
          </SidebarSection>
        )}

        {/* Avaliações com submenu */}
        {avaliacaoItems.some(shouldShowMenuItem) && (
          <SidebarSection title="">
            <div className="mb-2">
              <SidebarMenuItemWithSubmenu
                title="Avaliações"
                items={avaliacaoItems.filter(shouldShowMenuItem)}
                icon={avaliacaoItems[0]?.icon}
              />
            </div>
          </SidebarSection>
        )}

        {/* Gestão com submenu */}
        {gestaoItems.some(shouldShowMenuItem) && (
          <SidebarSection title="">
            <div className="mb-2">
              <SidebarMenuItemWithSubmenu
                title="Gestão"
                items={gestaoItems.filter(shouldShowMenuItem)}
                icon={gestaoItems[0]?.icon}
              />
            </div>
          </SidebarSection>
        )}

        {/* Portais */}
        {portalItems.some(shouldShowMenuItem) && (
          <SidebarSection title="Portais">
            <div className="space-y-2">
              {portalItems.filter(shouldShowMenuItem).map((item) => (
                <CustomSidebarMenuItem key={item.href} item={item} />
              ))}
              <EmployeePortalAccess />
            </div>
          </SidebarSection>
        )}

        {/* Faturamento */}
        {faturamentoItems.some(shouldShowMenuItem) && (
          <SidebarSection title="Faturamento">
            <div className="space-y-2">
              {faturamentoItems.filter(shouldShowMenuItem).map((item) => (
                <CustomSidebarMenuItem key={item.href} item={item} />
              ))}
            </div>
          </SidebarSection>
        )}

        {/* Configurações */}
        <SidebarSection title="Configurações">
          <div className="mt-2">
            <SettingsSubmenu />
          </div>
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              Sistema v2.0
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
