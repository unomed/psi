
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import psiSafeIcon from "@/assets/psi-safe-icon.png";

export function SidebarHeader() {
  return (
    <Header className="px-6 py-5 flex items-center border-b">
      <img 
        src={psiSafeIcon} 
        alt="PSI Safe NR 01" 
        className="w-8 h-8 flex-shrink-0 mr-3"
      />
      <div className="flex items-center">
        <h2 className="text-xl font-bold">PSI Safe</h2>
        <span className="ml-2 text-xs bg-psi-blue-100 text-psi-blue-800 px-2 py-0.5 rounded-full">
          NR 01
        </span>
      </div>
    </Header>
  );
}
