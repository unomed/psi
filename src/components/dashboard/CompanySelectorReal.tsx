import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CompanySelectorRealProps {
  selectedCompanyId: string | null;
  onCompanyChange: (companyId: string) => void;
}

const ALL_COMPANIES_VALUE = "all-companies";

export function CompanySelectorReal({ selectedCompanyId, onCompanyChange }: CompanySelectorRealProps) {
  const { userRole, userCompanies } = useAuth();

  // Filter and validate companies
  const validCompanies = (userCompanies || []).filter(company =>
    company &&
    company.companyId !== null &&
    company.companyId !== undefined &&
    String(company.companyId).trim() !== "" &&
    company.companyName &&
    String(company.companyName).trim() !== ""
  );

  // Don't show selector if no companies available
  if (!validCompanies || validCompanies.length === 0) {
    return null;
  }

  // Don't show selector if only one company and not superadmin
  if (validCompanies.length === 1 && userRole !== 'superadmin') {
    return null;
  }

  // Handle value conversion for Select component
  const selectValue = selectedCompanyId || ALL_COMPANIES_VALUE;

  // Handle change and convert back to null for "all companies"
  const handleValueChange = (value: string) => {
    const companyId = value === ALL_COMPANIES_VALUE ? "" : value;
    onCompanyChange(companyId);
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <Building2 className="h-4 w-4" />
      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {userRole === 'superadmin' && (
            <SelectItem value={ALL_COMPANIES_VALUE}>Todas as empresas</SelectItem>
          )}
          {validCompanies.map((company) => {
            const companyIdStr = String(company.companyId);
            return (
              <SelectItem key={companyIdStr} value={companyIdStr}>
                {company.companyName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
