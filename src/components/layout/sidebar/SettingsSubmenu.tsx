
import { Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { settingsMenuItems } from "./settingsItems";
import { useState, useEffect } from "react";
import { useCheckPermission } from "@/hooks/useCheckPermission";

interface SettingsSubmenuProps {
  userRole?: string;
}

export function SettingsSubmenu({ userRole }: SettingsSubmenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission, loadingPermission } = useCheckPermission();
  const isSettingsRoute = location.pathname.startsWith('/configuracoes');
  const [isOpen, setIsOpen] = useState(isSettingsRoute);
  
  useEffect(() => {
    if (isSettingsRoute && !isOpen) {
      setIsOpen(true);
    }
  }, [isSettingsRoute, isOpen]);
  
  // Don't show anything while loading permissions
  if (loadingPermission) {
    return null;
  }
  
  const filteredSettingsItems = settingsMenuItems.filter(item => {
    // Check if user role exists and item has roles array
    if (!userRole || !item.roles || !Array.isArray(item.roles)) {
      return false;
    }
    
    const hasRole = item.roles.includes(userRole);
    
    // If no role match, deny access
    if (!hasRole) {
      return false;
    }
    
    const hasPermissionCheck = hasPermission(item.permission);
    
    console.log(`Settings item ${item.title}: hasRole=${hasRole}, hasPermission=${hasPermissionCheck}`);
    
    return hasPermissionCheck;
  });

  if (filteredSettingsItems.length === 0) return null;

  const handleItemClick = (path: string) => {
    console.log(`[SettingsSubmenu] Navegando para: ${path}`);
    navigate(path);
  };

  return (
    <div className="space-y-1">
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
            <div key={item.title} className="w-full">
              <SidebarMenuButton
                className={cn(
                  "flex items-center w-full text-sm",
                  location.pathname === item.path && "bg-sidebar-accent"
                )}
                onClick={() => handleItemClick(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
