
import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarMenuSubItemComponent } from "./SidebarMenuItem";
import { CollapsibleMenuItem } from "./CollapsibleMenuItem";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { settingsItems } from "./settingsItems";

export function SettingsSubmenu() {
  const { userRole } = useAuth();
  const { hasPermission } = useCheckPermission();
  const location = useLocation();

  const filteredItems = settingsItems.filter((item) => {
    // Por enquanto, permitir acesso para todos os itens
    // Implementar verificação de permissão futuramente se necessário
    return true;
  });

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
