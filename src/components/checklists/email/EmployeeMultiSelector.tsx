
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import type { Employee } from "@/types/employee";

interface EmployeeMultiSelectorProps {
  selectedEmployees: Employee[];
  onSelectionChange: (employees: Employee[]) => void;
  companyId?: string;
}

export function EmployeeMultiSelector({ 
  selectedEmployees, 
  onSelectionChange,
  companyId 
}: EmployeeMultiSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { employees, isLoading } = useEmployees({ companyId });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cpf.includes(searchTerm)
  );

  const isSelected = (employee: Employee) => 
    selectedEmployees.some(emp => emp.id === employee.id);

  const toggleEmployee = (employee: Employee) => {
    if (isSelected(employee)) {
      onSelectionChange(selectedEmployees.filter(emp => emp.id !== employee.id));
    } else {
      onSelectionChange([...selectedEmployees, employee]);
    }
  };

  const removeEmployee = (employeeId: string) => {
    onSelectionChange(selectedEmployees.filter(emp => emp.id !== employeeId));
  };

  const selectAll = () => {
    onSelectionChange(filteredEmployees);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando funcionários...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="employee-search">Selecionar Funcionários</Label>
        <Badge variant="secondary">{selectedEmployees.length} selecionados</Badge>
      </div>

      {/* Selected employees */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
          {selectedEmployees.map(emp => (
            <Badge key={emp.id} variant="default" className="flex items-center gap-1">
              {emp.name}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeEmployee(emp.id)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Search and controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="employee-search"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" onClick={selectAll}>
          Todos
        </Button>
        <Button variant="outline" size="sm" onClick={clearAll}>
          Limpar
        </Button>
      </div>

      {/* Employee list */}
      <ScrollArea className="h-64 border rounded-md">
        <div className="p-4 space-y-2">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
              <Checkbox
                checked={isSelected(employee)}
                onCheckedChange={() => toggleEmployee(employee)}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{employee.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {employee.email} • {employee.role?.name} • {employee.sectors?.name}
                </div>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              Nenhum funcionário encontrado
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
