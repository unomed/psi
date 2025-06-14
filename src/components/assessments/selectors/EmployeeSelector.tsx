
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

  const baseFilteredEmployees = selectedRole
    ? (employees || []).filter(emp => emp.role_id === selectedRole)
    : [];

  const validEmployees = baseFilteredEmployees.filter(emp =>
    emp &&
    emp.id !== null &&
    emp.id !== undefined &&
    String(emp.id).trim() !== "" &&
    emp.name &&
    String(emp.name).trim() !== ""
  );

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
          {validEmployees.length > 0 ? (
            validEmployees.map((employee) => {
              const employeeIdStr = String(employee.id);
              if (employeeIdStr.trim() === "") {
                console.error("[Assessments/EmployeeSelector] Attempting to render SelectItem with empty value for employee:", employee);
                return null;
              }
              return (
                <SelectItem key={employeeIdStr} value={employeeIdStr}>
                  {employee.name}
                </SelectItem>
              );
            }).filter(Boolean)
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

