import { Building2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { CompanySelectorReal } from "@/components/dashboard/CompanySelectorReal";

export function CompanyIndicator() {
  const { selectedCompanyId, setSelectedCompanyId, selectedCompanyName } = useCompany();
  const { userRole } = useAuth();

  const handleCompanyChange = (companyId: string) => {
    // Convert empty string back to null for "all companies"
    setSelectedCompanyId(companyId || null);
  };

  // Se for superadmin ou não tem empresa selecionada, mostrar seletor
  if (userRole === 'superadmin' || !selectedCompanyId) {
    return (
      <div className="flex items-center gap-2">
        <CompanySelectorReal
          selectedCompanyId={selectedCompanyId}
          onCompanyChange={handleCompanyChange}
        />
      </div>
    );
  }

  // Se tem empresa selecionada e não é superadmin, mostrar indicador fixo
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Building2 className="h-4 w-4" />
      <span className="font-medium">{selectedCompanyName}</span>
    </div>
  );
}