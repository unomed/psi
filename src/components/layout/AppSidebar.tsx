
import { SidebarContent, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarSection } from "./sidebar/SidebarSection";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarMenuItemWithSubmenu } from "./sidebar/SidebarMenuItemWithSubmenu";
import { 
  dashboardItem, 
  cadastrosItems, 
  avaliacoesItems, 
  gestaoItems,
  portaisItems,
  faturamentoItem 
} from "./sidebar/menuItems";
import { settingsItems } from "./sidebar/settingsItems";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";

export function AppSidebar() {
  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <CustomSidebarHeader />
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto">
        {/* Dashboard */}
        <SidebarSection title="">
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem key={dashboardItem.href} item={dashboardItem} />
          </SidebarMenu>
        </SidebarSection>

        {/* CADASTROS */}
        <SidebarSection title="CADASTROS">
          <SidebarMenu className="space-y-1">
            {cadastrosItems.map((item) => (
              <SidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarMenu>
        </SidebarSection>

        {/* AVALIAÇÕES */}
        <SidebarSection title="AVALIAÇÕES">
          <SidebarMenu className="space-y-1">
            {avaliacoesItems.map((item) => (
              <SidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarMenu>
        </SidebarSection>

        {/* GESTÃO */}
        <SidebarSection title="GESTÃO">
          <SidebarMenu className="space-y-1">
            {gestaoItems.map((item) => (
              <SidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarMenu>
        </SidebarSection>

        {/* PORTAIS */}
        <SidebarSection title="PORTAIS">
          <SidebarMenu className="space-y-1">
            {portaisItems.map((item) => (
              <SidebarMenuItem key={item.href} item={item} />
            ))}
          </SidebarMenu>
        </SidebarSection>

        {/* FATURAMENTO */}
        <SidebarSection title="">
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem key={faturamentoItem.href} item={faturamentoItem} />
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
              roles: ["admin", "manager"]
            }))}
            icon={undefined}
          />
        </div>
      </SidebarContent>
    </>
  );
}
