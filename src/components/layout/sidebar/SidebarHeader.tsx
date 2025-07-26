
import { SidebarHeader as Header } from "@/components/ui/sidebar";

export function SidebarHeader() {
  return (
    <Header className="px-6 py-5 flex items-center border-b">
      <h2 className="text-xl font-bold">PSI Safe</h2>
      <span className="ml-2 text-xs bg-psi-blue-100 text-psi-blue-800 px-2 py-0.5 rounded-full">
        NR 01
      </span>
    </Header>
  );
}
