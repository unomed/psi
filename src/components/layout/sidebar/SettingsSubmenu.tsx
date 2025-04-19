
import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { settingsMenuItems } from "./settingsItems";
import { SidebarMenuItem as MenuItem } from "./SidebarMenuItem";
import { useState, useEffect } from "react";
import { useCheckPermission } from "@/hooks/useCheckPermission";

interface SettingsSubmenuProps {
  userRole?: string;
}

export function SettingsSubmenu({ userRole }: SettingsSubmenuProps) {
  const location = useLocation();
  const { hasPermission } = useCheckPermission();
  const isSettingsRoute = location.pathname.startsWith('/configuracoes');
  const [isOpen, setIsOpen] = useState(isSettingsRoute);
  
  useEffect(() => {
    if (isSettingsRoute && !isOpen) {
      setIsOpen(true);
    }
  }, [isSettingsRoute, isOpen]);
  
  const filteredSettingsItems = settingsMenuItems.filter(item => 
    userRole && 
    item.roles.includes(userRole) && 
    hasPermission(item.permission)
  );

  if (filteredSettingsItems.length === 0) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={cn(
          "flex items-center w-full",
          isSettingsRoute && "bg-sidebar-accent"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="mr-2 h-5 w-5" />
        <span>Configurações</span>
      </SidebarMenuButton>
      
      {isOpen && (
        <div className="ml-6 mt-2 space-y-1">
          {filteredSettingsItems.map((item) => (
            <MenuItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              path={item.path}
            />
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}
