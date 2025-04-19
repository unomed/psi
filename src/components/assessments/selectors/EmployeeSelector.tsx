
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployees";

interface EmployeeSelectorProps {
  selectedRole: string | null;
  selectedEmployee: string | null;
  onEmployeeChange: (value: string) => void;
}

export function EmployeeSelector({ 
  selectedRole, 
  selectedEmployee, 
  onEmployeeChange 
}: EmployeeSelectorProps) {
  const { employees = [], isLoading } = useEmployees();

  // Garantindo que employees seja sempre um array
  const employeesList = Array.isArray(employees) ? employees : [];
  
  // Garantindo que filtramos apenas quando temos um selectedRole válido
  const filteredEmployees = selectedRole 
    ? employeesList.filter(employee => employee.role_id === selectedRole)
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="employee">Funcionário</Label>
      <Select 
        onValueChange={onEmployeeChange} 
        value={selectedEmployee || ""}
        disabled={!selectedRole || isLoading}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder={selectedRole ? "Selecione um funcionário" : "Primeiro selecione uma função"} />
        </SelectTrigger>
        <SelectContent>
          {filteredEmployees && filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-employee" disabled>
              Nenhum funcionário disponível
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
