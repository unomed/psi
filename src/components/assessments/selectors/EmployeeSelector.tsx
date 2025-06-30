
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";

interface EmployeeSelectorProps {
  selectedRole?: string | null;
  selectedEmployee?: string | null;
  onEmployeeChange: (employeeId: string) => void;
  companyId?: string;
}

export function EmployeeSelector({
  selectedRole,
  selectedEmployee,
  onEmployeeChange,
  companyId
}: EmployeeSelectorProps) {
  const { userCompanies } = useAuth();
  const targetCompanyId = companyId || (userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined);
  
  const { data: employees, isLoading } = useEmployees(targetCompanyId);

  const filteredEmployees = selectedRole 
    ? employees?.filter(emp => emp.role_id === selectedRole)
    : employees;

  return (
    <div className="space-y-2">
      <Label htmlFor="employee">Funcionário</Label>
      <Select
        value={selectedEmployee || ""}
        onValueChange={onEmployeeChange}
        disabled={isLoading}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder="Selecione um funcionário" />
        </SelectTrigger>
        <SelectContent>
          {filteredEmployees?.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name} - {employee.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
