
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockEmployees } from "../mock/assessmentMockData";

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
  // Filter employees by role
  const filteredEmployees = selectedRole
    ? mockEmployees.filter(emp => emp.role_id === selectedRole)
    : [];
    
  // Ensure we always have at least one item to select
  const employees = filteredEmployees.length > 0 
    ? filteredEmployees 
    : [{ id: "", name: "Nenhum funcionário encontrado", email: "", role_id: "" }];

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
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
