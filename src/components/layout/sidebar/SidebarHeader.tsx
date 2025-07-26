
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import psiSafeIcon from "@/assets/psi-safe-icon.png";

export function SidebarHeader() {
  return (
    <Header className="px-4 py-4 border-b">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
          <img 
            src={psiSafeIcon} 
            alt="PSI Safe" 
            className="w-8 h-8 relative z-10 drop-shadow-sm"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-foreground tracking-tight">PSI Safe</h2>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">NR 01</span>
          </div>
        </div>
      </div>
    </Header>
  );
}
