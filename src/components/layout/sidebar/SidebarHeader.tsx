
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import psiSafeIcon from "@/assets/psi-safe-icon.png";

export function SidebarHeader() {
  return (
    <Header className="px-4 py-4 flex items-center gap-3 border-b">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
        <img 
          src={psiSafeIcon} 
          alt="PSI Safe" 
          className="w-8 h-8"
        />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">PSI Safe</h2>
        <p className="text-xs text-muted-foreground">NR 01</p>
      </div>
    </Header>
  );
}
