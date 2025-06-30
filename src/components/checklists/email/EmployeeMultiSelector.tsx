import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users, UserCheck, Building, Briefcase } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/types";

interface EmployeeMultiSelectorProps {
  companyId?: string;
  selectedEmployees: string[];
  onEmployeeSelect: (employeeId: string, selected: boolean) => void;
}

export function EmployeeMultiSelector({
  companyId,
  selectedEmployees,
  onEmployeeSelect
}: EmployeeMultiSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: employees, isLoading } = useEmployees(companyId);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleEmployeeCheckboxChange = (employeeId: string, checked: boolean) => {
    onEmployeeSelect(employeeId, checked);
  };

  const filteredEmployees = employees?.filter(employee => {
    const searchMatch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const sectorMatch = selectedSector ? employee.sectors?.id === selectedSector : true;
    const roleMatch = selectedRole ? employee.role?.id === selectedRole : true;

    return searchMatch && sectorMatch && roleMatch;
  }) || [];

  const sectors = [...new Set(employees?.map(employee => ({
    id: employee.sectors?.id,
    name: employee.sectors?.name
  })).filter(sector => sector.id && sector.name))];

  const roles = [...new Set(employees?.map(employee => ({
    id: employee.role?.id,
    name: employee.role?.name
  })).filter(role => role.id && role.name))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          <Users className="mr-2 h-4 w-4" />
          Selecionar Funcionários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <Select value={selectedSector || ""} onValueChange={(value) => setSelectedSector(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Setores</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedRole || ""} onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cargos</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">
            Carregando funcionários...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Nenhum funcionário encontrado.
          </div>
        ) : (
          <ScrollArea className="max-h-64 rounded-md border">
            {filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className="flex items-center justify-between space-x-2 p-2 hover:bg-accent"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`employee-${employee.id}`}
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={(checked) => handleEmployeeCheckboxChange(employee.id, !!checked)}
                  />
                  <label
                    htmlFor={`employee-${employee.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {employee.name}
                  </label>
                </div>
                <div className="flex items-center space-x-1">
                  {employee.sectors?.name && (
                    <Badge variant="secondary" className="text-xs">{employee.sectors.name}</Badge>
                  )}
                  {employee.role?.name && (
                    <Badge variant="outline" className="text-xs">{employee.role.name}</Badge>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
