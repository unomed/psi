
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

  // Filter employees by role
  const filteredEmployees = selectedRole
    ? employees.filter(emp => emp.role_id === selectedRole)
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
        value={selectedEmployee || ""}
        onValueChange={onEmployeeChange}
        disabled={!selectedRole}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder="Selecione um funcionário" />
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
