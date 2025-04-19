
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

  // Ensure we're always working with an array and properly filtering
  const filteredEmployees = selectedRole && Array.isArray(employees)
    ? employees.filter(employee => employee.role_id === selectedRole)
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="employee">Funcionário</Label>
      <Select 
        onValueChange={onEmployeeChange} 
        value={selectedEmployee || undefined}
        disabled={!selectedRole || isLoading}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder={selectedRole ? "Selecione um funcionário" : "Primeiro selecione uma função"} />
        </SelectTrigger>
        <SelectContent>
          {filteredEmployees.length > 0 ? (
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
