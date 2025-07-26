
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import { Shield } from "lucide-react";

export function SidebarHeader() {
  return (
    <Header className="px-6 py-5 flex items-center border-b">
      <div className="bg-white p-2 rounded-lg shadow-sm border">
        <Shield className="h-6 w-6 text-green-600" />
      </div>
      <div className="ml-3">
        <h2 className="text-xl font-bold text-gray-900">PSI Safe</h2>
        <span className="text-xs text-green-600 font-medium">NR 01</span>
      </div>
    </Header>
  );
}
