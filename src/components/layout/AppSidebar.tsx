
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
import { SidebarSection } from "./sidebar/SidebarSection";
import { CollapsibleMenuItem } from "./sidebar/CollapsibleMenuItem";
import { EmployeePortalAccess } from "./sidebar/EmployeePortalAccess";
import { SettingsSubmenu } from "./sidebar/SettingsSubmenu";
import { menuItems } from "./sidebar/menuItems";
import { settingsItems } from "./sidebar/settingsItems";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { Building2, Users, Briefcase, MapPin, FileText, ClipboardList, AlertTriangle, Target, FileBarChart, Calendar, UserCheck, CreditCard } from "lucide-react";
import { BarChart3 } from "lucide-react";

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
      <SidebarContent className="px-2">
        {/* Dashboard */}
        <SidebarSection title="">
          {dashboardItems.filter(shouldShowMenuItem).map((item) => (
            <CustomSidebarMenuItem key={item.href} item={item} />
          ))}
        </SidebarSection>

        {/* Cadastros */}
        {cadastroItems.some(shouldShowMenuItem) && (
          <SidebarSection title="Cadastros">
            {cadastroItems.filter(shouldShowMenuItem).map((item) => (
              <CustomSidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarSection>
        )}

        {/* Avaliações */}
        {avaliacaoItems.some(shouldShowMenuItem) && (
          <SidebarSection title="Avaliações">
            {avaliacaoItems.filter(shouldShowMenuItem).map((item) => (
              <CustomSidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarSection>
        )}

        {/* Gestão */}
        {gestaoItems.some(shouldShowMenuItem) && (
          <SidebarSection title="Gestão">
            {gestaoItems.filter(shouldShowMenuItem).map((item) => (
              <CustomSidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarSection>
        )}

        {/* Portais */}
        {portalItems.some(shouldShowMenuItem) && (
          <SidebarSection title="Portais">
            {portalItems.filter(shouldShowMenuItem).map((item) => (
              <CustomSidebarMenuItem key={item.href} item={item} />
            ))}
            <EmployeePortalAccess />
          </SidebarSection>
        )}

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
          <CollapsibleMenuItem 
            items={settingsItems.filter(shouldShowMenuItem)}
            defaultOpen={false}
          />
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SettingsSubmenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
