
import { Employee } from "@/types";
import { EmployeeDataTable } from "./EmployeeDataTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LoadingState } from "@/components/core/LoadingState";

interface EmployeeListSectionProps {
  employees?: Employee[];
  filteredEmployees?: Employee[];
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onCreateClick?: () => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onView?: (employee: Employee) => void;
}

export function EmployeeListSection({ 
  employees,
  filteredEmployees,
  isLoading,
  searchTerm,
  onSearchChange,
  onCreateClick,
  onEdit,
  onDelete,
  onView
}: EmployeeListSectionProps) {
  const displayEmployees = filteredEmployees || employees || [];

  if (isLoading) {
    return <LoadingState message="Carregando funcionários..." />;
  }

  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}
      
      <EmployeeDataTable 
        employees={displayEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    </div>
  );
}
