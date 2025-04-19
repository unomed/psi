
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SettingsSubmenu } from "./sidebar/SettingsSubmenu";
import { mainMenuItems } from "./sidebar/menuItems";
import { UserProfileMenu } from "./UserProfileMenu";

export function AppSidebar() {
  const { userRole } = useAuth();

  const filteredMenuItems = mainMenuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <Sidebar className="border-r">
      <SidebarHeader />
      
      <UserProfileMenu />
      
      <SidebarContent className="flex flex-col h-[calc(100%-120px)]">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  path={item.path}
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
