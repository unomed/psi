
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanyFilter } from "@/hooks/useCompanyFilter";
import { Building2 } from "lucide-react";

export function CompanySelector() {
  const { 
    selectedCompanyId, 
    setSelectedCompanyId, 
    availableCompanies, 
    canAccessAllCompanies 
  } = useCompanyFilter();

  // Early return if no companies available
  if (!availableCompanies || availableCompanies.length === 0) {
    return null;
  }

  // Don't show selector if only one company available and user cannot access all companies
  if (availableCompanies.length === 1 && !canAccessAllCompanies()) {
    return null;
  }

  // Show selector for superadmin with multiple companies or regular users with multiple companies
  return (
    <div className="flex items-center gap-2 mb-4">
      <Building2 className="h-4 w-4" />
      <Select value={selectedCompanyId || ""} onValueChange={setSelectedCompanyId}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {canAccessAllCompanies() && (
            <SelectItem value="">Todas as empresas</SelectItem>
          )}
          {availableCompanies.map((company) => (
            <SelectItem key={company.companyId} value={company.companyId}>
              {company.companyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
