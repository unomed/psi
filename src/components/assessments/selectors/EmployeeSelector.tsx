
import React from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeSelect } from "@/components/ui/SafeSelect";
import type { Employee } from "@/types/employee"; // Assuming Employee type exists

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

  const filteredEmployees = selectedRole
    ? (employees || []).filter(emp => emp.role_id === selectedRole) // Make sure your Employee type has role_id
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
      <SafeSelect<Employee>
        data={filteredEmployees}
        value={selectedEmployee}
        onChange={onEmployeeChange}
        placeholder={selectedRole ? "Selecione um funcionário" : "Selecione uma função primeiro"}
        valueField="id"
        labelField="name"
        disabled={!selectedRole}
        className="w-full"
      />
    </div>
  );
}
