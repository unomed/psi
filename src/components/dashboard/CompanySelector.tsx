
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
      <Select value={selectedCompanyId || "all-companies"} onValueChange={setSelectedCompanyId}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {canAccessAllCompanies() && (
            <SelectItem value="all-companies">Todas as empresas</SelectItem>
          )}
          {availableCompanies.map((company) => {
            const companyId = company.companyId || `company-fallback-${Date.now()}`;
            if (!companyId || companyId.trim() === '') {
              console.error('Empty company ID detected in CompanySelector:', company);
              return null;
            }
            return (
              <SelectItem key={companyId} value={companyId}>
                {company.companyName || 'Empresa sem nome'}
              </SelectItem>
            );
          }).filter(Boolean)}
        </SelectContent>
      </Select>
    </div>
  );
}
