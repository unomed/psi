
import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarMenuItem, SidebarMenuSubItemComponent } from "./SidebarMenuItem";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { settingsItems } from "./settingsItems";

export function SettingsSubmenu() {
  const { userRole } = useAuth();
  const { hasPermission } = useCheckPermission();
  const location = useLocation();

  const filteredItems = settingsItems.filter((item) => {
    const hasRole = !item.roles || item.roles.includes(userRole!);
    const hasItemPermission = !item.permission || hasPermission(item.permission);
    
    console.log(`Settings item ${item.title}: hasRole=${hasRole}, hasPermission=${hasItemPermission}`);
    
    return hasRole && hasItemPermission;
  });

  const isSettingsActive = location.pathname.startsWith('/configuracoes');

  return (
    <SidebarMenuItem
      title="Configurações"
      icon={Settings}
      isActive={isSettingsActive}
      hasSubmenu={true}
    >
      {filteredItems.map((item) => (
        <SidebarMenuSubItemComponent
          key={item.href}
          title={item.title}
          href={item.href}
          isActive={location.pathname === item.href}
        />
      ))}
    </SidebarMenuItem>
  );
}
