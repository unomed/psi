
import { SidebarContent, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarSection } from "./sidebar/SidebarSection";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarMenuItemWithSubmenu } from "./sidebar/SidebarMenuItemWithSubmenu";
import { menuItems } from "./sidebar/menuItems";
import { settingsItems } from "./sidebar/settingsItems";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";

export function AppSidebar() {
  return (
    <>
      <SidebarHeader>
        <CustomSidebarHeader />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarSection title="">
          <SidebarMenu>
            {menuItems.map((item) => {
              if (item.subItems) {
                return (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    title={item.title}
                    items={item.subItems}
                    icon={item.icon}
                  />
                );
              }
              return <SidebarMenuItem key={item.href} item={item} />;
            })}
          </SidebarMenu>
        </SidebarSection>

        <SidebarSection title="Configurações">
          <SidebarMenu>
            {settingsItems.map((item) => {
              // Convert settingsItem (with url) to MenuItem (with href)
              const menuItem = {
                title: item.title,
                href: item.url,
                icon: item.icon,
                roles: ["admin", "manager"] // Default roles for settings items
              };
              return <SidebarMenuItem key={item.url} item={menuItem} />;
            })}
          </SidebarMenu>
        </SidebarSection>
      </SidebarContent>
    </>
  );
}
