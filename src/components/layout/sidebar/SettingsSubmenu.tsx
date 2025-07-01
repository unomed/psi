
import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarMenuSubItemComponent } from "./SidebarMenuItem";
import { CollapsibleMenuItem } from "./CollapsibleMenuItem";
import { MenuItemGuard } from "./MenuItemGuard";
import { settingsItems } from "./settingsItems";

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
    <CollapsibleMenuItem
      title="Configurações"
      icon={Settings}
      isActive={isSettingsActive}
      hasSubmenu={true}
    >
      {settingsItems.map((item) => (
        <MenuItemGuard 
          key={item.url} 
          routeKey={getRouteKeyForItem(item.url)}
        >
          <SidebarMenuSubItemComponent
            title={item.title}
            href={item.url}
            isActive={location.pathname === item.url}
          />
        </MenuItemGuard>
      ))}
    </CollapsibleMenuItem>
  );
}
