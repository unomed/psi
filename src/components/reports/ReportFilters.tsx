
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Dispatch, SetStateAction } from "react";
import { CompanyAccess } from "@/hooks/useUserRole";
import { DateRange } from "@/types/date";

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
  const sectors = [
    { id: 'all-sectors', name: 'Todos os Setores' },
    { id: 'production', name: 'Produção' },
    { id: 'admin', name: 'Administrativo' },
    { id: 'it', name: 'TI' },
    { id: 'commercial', name: 'Comercial' },
    { id: 'logistics', name: 'Logística' },
  ].filter(sector => sector && sector.id && String(sector.id).trim() !== "" && sector.name && String(sector.name).trim() !== "");
  
  const roles = [
    { id: 'all-roles', name: 'Todas as Funções' },
    { id: 'manager', name: 'Gerente' },
    { id: 'analyst', name: 'Analista' },
    { id: 'operator', name: 'Operador' },
    { id: 'assistant', name: 'Assistente' },
    { id: 'technician', name: 'Técnico' },
  ].filter(role => role && role.id && String(role.id).trim() !== "" && role.name && String(role.name).trim() !== "");

  const validCompanies = (userCompanies || []).filter(company => 
    company && 
    company.companyId !== null && 
    company.companyId !== undefined && 
    String(company.companyId).trim() !== "" &&
    company.companyName && 
    String(company.companyName).trim() !== ""
  );
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {onCompanyChange && validCompanies && validCompanies.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Select 
                value={selectedCompany || (validCompanies[0]?.companyId ? String(validCompanies[0].companyId) : undefined)} 
                onValueChange={onCompanyChange}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {validCompanies.map(company => (
                      <SelectItem key={String(company.companyId)} value={String(company.companyId)}>
                        {company.companyName}
                      </SelectItem>
                  ))}
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
                {sectors.map(sector => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                ))}
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
                {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
