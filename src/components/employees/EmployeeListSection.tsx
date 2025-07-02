
import { Employee } from "@/types/employee";
import { DataTable } from "@/components/ui/data-table";
import { createColumns } from "@/components/employees/columns";
import { EmptyEmployeeState } from "@/components/employees/EmptyEmployeeState";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";

interface EmployeeListSectionProps {
  filteredEmployees: Employee[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onView: (employee: Employee) => void;
  employeeMoods?: Record<string, any>;
}

export function EmployeeListSection({
  filteredEmployees,
  isLoading,
  searchTerm,
  onSearchChange,
  onCreateClick,
  onEdit,
  onDelete,
  onView,
  employeeMoods
}: EmployeeListSectionProps) {
  return (
    <>
      <div className="space-y-4">
        <EmployeeSearch 
          search={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>

      {filteredEmployees?.length === 0 && !isLoading ? (
        <EmptyEmployeeState onCreateClick={onCreateClick} />
      ) : (
        <DataTable 
          columns={createColumns(employeeMoods)} 
          data={filteredEmployees || []}
          isLoading={isLoading}
          meta={{
            onEdit,
            onDelete,
            onView,
          }}
        />
      )}
    </>
  );
}
