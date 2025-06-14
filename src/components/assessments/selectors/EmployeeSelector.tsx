
import React from "react";
import { useEmployees } from "@/hooks/useEmployees";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeSelectorProps {
  selectedRole: string | null;
  selectedEmployee: string | null;
  onEmployeeChange: (employeeId: string) => void;
}

export function EmployeeSelector({
  selectedRole,
  selectedEmployee,
  onEmployeeChange,
}: EmployeeSelectorProps) {
  const { employees, isLoading } = useEmployees();

  // Filter employees by role and ensure valid data
  const filteredEmployees = selectedRole
    ? employees.filter(emp => 
        emp && 
        emp.role_id === selectedRole &&
        emp.id && 
        emp.id.toString().trim() !== "" &&
        emp.name && 
        emp.name.trim() !== ""
      )
    : [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Funcionário</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="employee">Funcionário</Label>
      <Select
        value={selectedEmployee || "no-employee-selected"}
        onValueChange={onEmployeeChange}
        disabled={!selectedRole}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder="Selecione um funcionário" />
        </SelectTrigger>
        <SelectContent>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <SelectItem key={employee.id} value={String(employee.id)}>
                {employee.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-employees-available" disabled>
              {selectedRole ? "Nenhum funcionário encontrado" : "Selecione uma função primeiro"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
