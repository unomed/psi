
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { SafeSidebarContent } from "./sidebar/SafeSidebarContent";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const { userRole } = useAuth();

  console.log('[AppSidebar] Current user role:', userRole);

  try {
    return (
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="border-b border-sidebar-border">
          <CustomSidebarHeader />
        </SidebarHeader>
        
        <SidebarContent className="overflow-y-auto">
          <SafeSidebarContent />
        </SidebarContent>
      </Sidebar>
    );
  } catch (error) {
    console.error('[AppSidebar] Erro na renderização da sidebar:', error);
    
    // Fallback para layout simplificado
    return (
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold">PSI Safe</h2>
          <p className="text-sm text-muted-foreground">Sistema temporariamente em modo simplificado</p>
        </div>
      </div>
    );
  }
}
