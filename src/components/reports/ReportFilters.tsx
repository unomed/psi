
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
  // Mock data - em uma aplicação real, isso viria de uma API
  const sectors = [
    { id: 'all-sectors', name: 'Todos os Setores' },
    { id: 'production', name: 'Produção' },
    { id: 'admin', name: 'Administrativo' },
    { id: 'it', name: 'TI' },
    { id: 'commercial', name: 'Comercial' },
    { id: 'logistics', name: 'Logística' },
  ];
  
  const roles = [
    { id: 'all-roles', name: 'Todas as Funções' },
    { id: 'manager', name: 'Gerente' },
    { id: 'analyst', name: 'Analista' },
    { id: 'operator', name: 'Operador' },
    { id: 'assistant', name: 'Assistente' },
    { id: 'technician', name: 'Técnico' },
  ];
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Seletor de Empresa (apenas se o usuário tiver empresas associadas) */}
          {onCompanyChange && userCompanies && userCompanies.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Select 
                value={selectedCompany || "default-company"} 
                onValueChange={onCompanyChange}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {userCompanies.map(company => {
                    const companyId = company.companyId || `company-fallback-${Date.now()}`;
                    if (!companyId || companyId.trim() === '') {
                      console.error('Empty company ID detected in ReportFilters:', company);
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
                {sectors.map(sector => {
                  if (!sector.id || sector.id.trim() === '') {
                    console.error('Empty sector ID detected in ReportFilters:', sector);
                    return null;
                  }
                  return (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name || 'Setor sem nome'}
                    </SelectItem>
                  );
                }).filter(Boolean)}
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
                {roles.map(role => {
                  if (!role.id || role.id.trim() === '') {
                    console.error('Empty role ID detected in ReportFilters:', role);
                    return null;
                  }
                  return (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name || 'Função sem nome'}
                    </SelectItem>
                  );
                }).filter(Boolean)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
