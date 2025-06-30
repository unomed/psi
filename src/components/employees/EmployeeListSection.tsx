import { Employee } from "@/types";
import { EmployeeDataTable } from "./EmployeeDataTable";

interface EmployeeListSectionProps {
  employees: Employee[];
}

export function EmployeeListSection({ employees }: EmployeeListSectionProps) {
  return (
    <div>
      <EmployeeDataTable employees={employees} />
    </div>
  );
}
