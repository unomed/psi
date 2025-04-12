
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { mockEmployees } from "../mock/assessmentMockData";

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
  const filteredEmployees = selectedRole 
    ? mockEmployees.filter(emp => emp.roleId === selectedRole)
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="employee">Funcionário</Label>
      <Select 
        onValueChange={onEmployeeChange} 
        value={selectedEmployee || undefined}
        disabled={!selectedRole}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder={selectedRole ? "Selecione um funcionário" : "Primeiro selecione uma função"} />
        </SelectTrigger>
        <SelectContent>
          {filteredEmployees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
