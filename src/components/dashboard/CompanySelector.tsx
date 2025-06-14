
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

  // Filter companies rigorously
  const validCompanies = availableCompanies.filter(company => 
    company && 
    company.companyId !== null && 
    company.companyId !== undefined && 
    String(company.companyId).trim() !== "" &&
    company.companyName && // Ensure name also exists, though not for value
    String(company.companyName).trim() !== ""
  );

  console.log("[CompanySelector] Rendering. SelectedID:", selectedCompanyId, "Filtered companies:", validCompanies);

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
          {validCompanies.map((company) => {
            // Log each company's details before creating SelectItem
            console.log("[CompanySelector] Mapping company:", company, "Value to be used:", String(company.companyId));
            return (
              <SelectItem key={String(company.companyId)} value={String(company.companyId)}>
                {company.companyName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
