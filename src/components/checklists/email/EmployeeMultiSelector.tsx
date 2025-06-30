
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Employee } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";

interface EmployeeMultiSelectorProps {
  onEmployeeSelect: (employees: Employee[]) => void;
}

export function EmployeeMultiSelector({ onEmployeeSelect }: EmployeeMultiSelectorProps) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  const { data: employees = [] } = useEmployees(companyId);
  
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Get unique companies, sectors, and roles
  const companies = Array.from(new Set(employees.map(emp => emp.company_id)));
  const sectors = Array.from(new Set(employees.map(emp => emp.sector_id)));
  const roles = Array.from(new Set(employees.map(emp => emp.role_id)));

  // Filter employees based on selections
  const filteredEmployees = employees.filter(emp => {
    if (selectedCompany && emp.company_id !== selectedCompany) return false;
    if (selectedSector && emp.sector_id !== selectedSector) return false;
    if (selectedRole && emp.role_id !== selectedRole) return false;
    return true;
  });

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee && !selectedEmployees.find(emp => emp.id === employeeId)) {
      const newSelection = [...selectedEmployees, employee];
      setSelectedEmployees(newSelection);
      onEmployeeSelect(newSelection);
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    const newSelection = selectedEmployees.filter(emp => emp.id !== employeeId);
    setSelectedEmployees(newSelection);
    onEmployeeSelect(newSelection);
  };

  const handleSelectAll = () => {
    const newSelection = filteredEmployees.filter(emp => 
      !selectedEmployees.find(selected => selected.id === emp.id)
    );
    const combined = [...selectedEmployees, ...newSelection];
    setSelectedEmployees(combined);
    onEmployeeSelect(combined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Funcionários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as empresas</SelectItem>
              {companies.map((companyId) => (
                <SelectItem key={companyId} value={companyId}>
                  {companyId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger>
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os setores</SelectItem>
              {sectors.map((sectorId) => (
                <SelectItem key={sectorId} value={sectorId}>
                  {sectorId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os cargos</SelectItem>
              {roles.map((roleId) => (
                <SelectItem key={roleId} value={roleId}>
                  {roleId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select onValueChange={handleEmployeeSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar funcionário..." />
            </SelectTrigger>
            <SelectContent>
              {filteredEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleSelectAll} variant="outline">
            Selecionar Todos
          </Button>
        </div>

        {selectedEmployees.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Funcionários Selecionados ({selectedEmployees.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedEmployees.map((employee) => (
                <Badge key={employee.id} variant="secondary" className="flex items-center gap-1">
                  {employee.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveEmployee(employee.id)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
