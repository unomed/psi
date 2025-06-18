
import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MenuItemGuard } from "./MenuItemGuard";
import { settingsItems } from "./settingsItems";
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from '@/components/ui/sidebar';

export function SettingsSubmenu() {
  const location = useLocation();
  const isSettingsActive = location.pathname.startsWith('/configuracoes');

  // Mapear itens para suas configurações de acesso
  const getRouteKeyForItem = (url: string) => {
    switch (url) {
      case '/configuracoes/permissoes':
        return 'permissions' as const;
      case '/configuracoes/usuarios':
        return 'users' as const;
      default:
        return 'settings' as const;
    }
  };

  return (
    <div className="space-y-1">
      {/* Header do submenu */}
      <BaseSidebarMenuItem className="list-none">
        <SidebarMenuButton 
          className={`w-full px-3 py-2 transition-all duration-200 rounded-md ${
            isSettingsActive 
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-sidebar-primary' 
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Configurações</span>
          </div>
        </SidebarMenuButton>
      </BaseSidebarMenuItem>

      {/* Itens do submenu */}
      {isSettingsActive && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-sidebar-border pl-4">
          {settingsItems.map((item) => (
            <MenuItemGuard 
              key={item.url} 
              routeKey={getRouteKeyForItem(item.url)}
            >
              <BaseSidebarMenuItem className="list-none">
                <SidebarMenuButton 
                  className={`w-full px-3 py-2 transition-all duration-200 rounded-md ${
                    location.pathname === item.url 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm border-l-2 border-sidebar-primary' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <a href={item.url} className="flex items-center gap-3 w-full">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="text-sm">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </BaseSidebarMenuItem>
            </MenuItemGuard>
          ))}
        </div>
      )}
    </div>
  );
}
