
import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarMenuSubItemComponent } from "./SidebarMenuItem";
import { CollapsibleMenuItem } from "./CollapsibleMenuItem";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissionGuard } from "@/hooks/permissions/usePermissionGuard";
import { settingsItems } from "./settingsItems";

export function SettingsSubmenu() {
  const { userRole } = useAuth();
  const { 
    canAccessPermissionsPage, 
    canAccessUsersPage, 
    canAccessCompaniesPage, 
    canAccessBillingPage,
    canAccessSettingsPage 
  } = usePermissionGuard();
  const location = useLocation();

  const filteredItems = settingsItems.filter((item) => {
    switch (item.url) {
      case '/configuracoes/permissoes':
        return canAccessPermissionsPage();
      case '/configuracoes/usuarios':
        return canAccessUsersPage();
      case '/configuracoes/empresas':
        return canAccessCompaniesPage();
      case '/configuracoes/faturamento':
        return canAccessBillingPage();
      default:
        return canAccessSettingsPage();
    }
  });

  // Se o usuário não tem acesso a nenhuma configuração, não mostrar o menu
  if (filteredItems.length === 0) {
    return null;
  }

  const isSettingsActive = location.pathname.startsWith('/configuracoes');

  return (
    <CollapsibleMenuItem
      title="Configurações"
      icon={Settings}
      isActive={isSettingsActive}
      hasSubmenu={true}
    >
      {filteredItems.map((item) => (
        <SidebarMenuSubItemComponent
          key={item.url}
          title={item.title}
          href={item.url}
          isActive={location.pathname === item.url}
        />
      ))}
    </CollapsibleMenuItem>
  );
}
