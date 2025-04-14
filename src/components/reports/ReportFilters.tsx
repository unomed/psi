
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Dispatch, SetStateAction } from "react";

interface ReportFiltersProps {
  dateRange: DateRange;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

export function ReportFilters({
  dateRange,
  setDateRange,
  selectedSector,
  setSelectedSector,
  selectedRole,
  setSelectedRole
}: ReportFiltersProps) {
  // Mock data - em uma aplicação real, isso viria de uma API
  const sectors = [
    { id: 'all', name: 'Todos os Setores' },
    { id: 'production', name: 'Produção' },
    { id: 'admin', name: 'Administrativo' },
    { id: 'it', name: 'TI' },
    { id: 'commercial', name: 'Comercial' },
    { id: 'logistics', name: 'Logística' },
  ];
  
  const roles = [
    { id: 'all', name: 'Todas as Funções' },
    { id: 'manager', name: 'Gerente' },
    { id: 'analyst', name: 'Analista' },
    { id: 'operator', name: 'Operador' },
    { id: 'assistant', name: 'Assistente' },
    { id: 'technician', name: 'Técnico' },
  ];
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-range">Período</Label>
            <DatePickerWithRange 
              dateRange={dateRange} 
              setDateRange={setDateRange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
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
            <Select value={selectedRole} onValueChange={setSelectedRole}>
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
