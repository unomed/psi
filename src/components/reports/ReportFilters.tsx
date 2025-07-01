
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Dispatch, SetStateAction } from "react";
import { CompanyAccess } from "@/hooks/useUserRole";
import { DateRange } from "@/types/date";
import { useReportsData } from "@/hooks/reports/useReportsData";

interface ReportFiltersProps {
  dateRange: DateRange;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedCompany?: string | null;
  onCompanyChange?: (value: string) => void;
  userCompanies?: CompanyAccess[];
  userRole?: string | null;
}

export function ReportFilters({
  dateRange,
  setDateRange,
  selectedSector,
  setSelectedSector,
  selectedRole,
  setSelectedRole,
  selectedCompany,
  onCompanyChange,
  userCompanies = [],
  userRole
}: ReportFiltersProps) {
  // Buscar setores e funções reais do banco de dados
  const { reportsData } = useReportsData(selectedCompany || undefined);

  const validCompanies = (userCompanies || []).filter(company =>
    company &&
    company.companyId !== null &&
    company.companyId !== undefined &&
    String(company.companyId).trim() !== "" &&
    company.companyName &&
    String(company.companyName).trim() !== ""
  );

  // Determine a safe default for company select if onCompanyChange is defined
  let companySelectValue = selectedCompany;
  if (onCompanyChange && !selectedCompany && validCompanies.length > 0) {
    companySelectValue = String(validCompanies[0].companyId);
  } else if (onCompanyChange && !selectedCompany) {
    companySelectValue = "no-company-filter-selected";
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {onCompanyChange && (
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Select
                value={companySelectValue || "no-company-filter-selected-value"}
                onValueChange={onCompanyChange}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {validCompanies.map(company => {
                    const companyIdStr = String(company.companyId);
                     if (companyIdStr.trim() === "") {
                       console.error("[ReportFilters] Attempting to render Company SelectItem with empty value:", company);
                       return null;
                     }
                    return (
                      <SelectItem key={companyIdStr} value={companyIdStr}>
                        {company.companyName}
                      </SelectItem>
                    );
                  }).filter(Boolean)}
                  {validCompanies.length === 0 && (
                     <SelectItem value="no-report-companies-available" disabled>Nenhuma empresa</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date-range">Período</Label>
            <DatePickerWithRange
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Select value={selectedSector || "all-sectors"} onValueChange={setSelectedSector}>
              <SelectTrigger id="sector">
                <SelectValue placeholder="Todos os Setores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-sectors">Todos os Setores</SelectItem>
                {reportsData?.sectors?.map(sector => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select value={selectedRole || "all-roles"} onValueChange={setSelectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Todas as Funções" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">Todas as Funções</SelectItem>
                {reportsData?.roles?.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
