
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
    console.log("[CompanySelector] No available companies, returning null.");
    return null;
  }

  // Don't show selector if only one company available and user cannot access all companies
  if (availableCompanies.length === 1 && !canAccessAllCompanies()) {
    console.log("[CompanySelector] Only one company and no access to all, returning null.");
    return null;
  }

  // Filter companies rigorously
  const validCompanies = availableCompanies.filter(company =>
    company &&
    company.companyId !== null &&
    company.companyId !== undefined &&
    String(company.companyId).trim() !== "" &&
    company.companyName &&
    String(company.companyName).trim() !== ""
  );

  console.log("[CompanySelector] Rendering. SelectedID:", selectedCompanyId, "Initial available companies:", availableCompanies.length, "Filtered valid companies:", validCompanies.length);

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
            const companyIdStr = String(company.companyId);
            // console.log("[CompanySelector] Mapping company:", company, "Value to be used:", companyIdStr);
            if (companyIdStr.trim() === "") {
              console.error("[CompanySelector] CRITICAL: Filter failed. Attempting to render SelectItem with empty value. Company:", company);
              return null; 
            }
            return (
              <SelectItem key={companyIdStr} value={companyIdStr}>
                {company.companyName}
              </SelectItem>
            );
          }).filter(Boolean)}
        </SelectContent>
      </Select>
    </div>
  );
}

