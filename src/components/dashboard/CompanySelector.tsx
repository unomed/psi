
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

  // Don't show selector if user can access all companies and has access to multiple
  if (canAccessAllCompanies() && availableCompanies.length > 1) {
    return null;
  }

  // Don't show if only one company available
  if (availableCompanies.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Building2 className="h-4 w-4" />
      <Select value={selectedCompanyId || ""} onValueChange={setSelectedCompanyId}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
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
