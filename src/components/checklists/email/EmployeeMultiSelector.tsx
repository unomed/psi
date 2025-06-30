
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";
import { Search } from "lucide-react";

export interface EmployeeMultiSelectorProps {
  selectedEmployees?: Employee[];
  onSelectionChange?: (employees: Employee[]) => void;
  onEmployeesChange?: (employees: Employee[]) => void;
}

export function EmployeeMultiSelector({ 
  selectedEmployees = [], 
  onSelectionChange,
  onEmployeesChange 
}: EmployeeMultiSelectorProps) {
  const { user } = useAuth();
  const { data: employees, isLoading } = useEmployees(user?.user_metadata?.companyId);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelected, setInternalSelected] = useState<Employee[]>(selectedEmployees);

  useEffect(() => {
    setInternalSelected(selectedEmployees);
  }, [selectedEmployees]);

  const filteredEmployees = employees?.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.cpf.includes(searchTerm) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEmployeeToggle = (employee: Employee, checked: boolean) => {
    let updatedSelection: Employee[];
    
    if (checked) {
      updatedSelection = [...internalSelected, employee];
    } else {
      updatedSelection = internalSelected.filter(e => e.id !== employee.id);
    }
    
    setInternalSelected(updatedSelection);
    onSelectionChange?.(updatedSelection);
    onEmployeesChange?.(updatedSelection);
  };

  const handleSelectAll = () => {
    const allSelected = filteredEmployees;
    setInternalSelected(allSelected);
    onSelectionChange?.(allSelected);
    onEmployeesChange?.(allSelected);
  };

  const handleClearAll = () => {
    setInternalSelected([]);
    onSelectionChange?.([]);
    onEmployeesChange?.([]);
  };

  if (isLoading) {
    return <div className="text-center p-4">Carregando funcionários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Selecionar Funcionários</span>
          <span className="text-sm font-normal text-muted-foreground">
            {internalSelected.length} selecionado(s)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            Selecionar Todos
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAll}
          >
            Limpar Seleção
          </Button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
              <Checkbox
                id={`employee-${employee.id}`}
                checked={internalSelected.some(e => e.id === employee.id)}
                onCheckedChange={(checked) => handleEmployeeToggle(employee, checked as boolean)}
              />
              <label
                htmlFor={`employee-${employee.id}`}
                className="flex-1 cursor-pointer"
              >
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-muted-foreground">
                  {employee.email} • {employee.cpf}
                </div>
              </label>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center p-4 text-muted-foreground">
            Nenhum funcionário encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
