
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
import { SettingsSubmenu } from "./sidebar/SettingsSubmenu";
import { menuItems } from "./sidebar/menuItems";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { ExternalLink } from "lucide-react";

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
  const faturamentoItems = menuItems.filter(item => 
    item.href === "/faturamento"
  );

  const handlePortalClick = () => {
    window.open('https://avaliacao.unomed.med.br', '_blank');
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2 py-2">
        {/* Dashboard */}
        {dashboardItems.filter(shouldShowMenuItem).map((item) => (
          <CustomSidebarMenuItem key={item.href} item={item} />
        ))}

        {/* Cadastros com submenu */}
        {cadastroItems.some(shouldShowMenuItem) && (
          <SidebarMenuItemWithSubmenu
            title="Cadastros"
            items={cadastroItems.filter(shouldShowMenuItem)}
            icon={cadastroItems[0]?.icon}
          />
        )}

        {/* Avaliações com submenu */}
        {avaliacaoItems.some(shouldShowMenuItem) && (
          <SidebarMenuItemWithSubmenu
            title="Avaliações"
            items={avaliacaoItems.filter(shouldShowMenuItem)}
            icon={avaliacaoItems[0]?.icon}
          />
        )}

        {/* Gestão com submenu */}
        {gestaoItems.some(shouldShowMenuItem) && (
          <SidebarMenuItemWithSubmenu
            title="Gestão"
            items={gestaoItems.filter(shouldShowMenuItem)}
            icon={gestaoItems[0]?.icon}
          />
        )}

        {/* Portal do Funcionário - Link simples */}
        <SidebarSection title="Portais">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handlePortalClick}>
              <div className="flex items-center gap-2 w-full">
                <ExternalLink className="h-4 w-4" />
                <span>Portal do Funcionário</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarSection>

        {/* Faturamento */}
        {faturamentoItems.some(shouldShowMenuItem) && (
          <SidebarSection title="Faturamento">
            {faturamentoItems.filter(shouldShowMenuItem).map((item) => (
              <CustomSidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarSection>
        )}

        {/* Configurações */}
        <SidebarSection title="Configurações">
          <SettingsSubmenu />
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
