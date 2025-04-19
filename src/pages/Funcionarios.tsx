
import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/employees/columns";
import { Employee, EmployeeFormData } from "@/types/employee";
import { EmptyEmployeeState } from "@/components/employees/EmptyEmployeeState";
import { EmployeeHeader } from "@/components/employees/EmployeeHeader";
import { EmployeeDialogs } from "@/components/employees/dialogs/EmployeeDialogs";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";

export default function Funcionarios() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { employees, isLoading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();

  const filteredEmployees = employees?.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = employee.name.toLowerCase().includes(searchLower);
    const matchesCpf = employee.cpf.toLowerCase().includes(searchLower);
    const matchesEmail = employee.email?.toLowerCase().includes(searchLower) || false;
    
    return matchesName || matchesCpf || matchesEmail;
  });

  const handleCreate = async (data: EmployeeFormData) => {
    try {
      await createEmployee.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const handleEdit = async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;
    try {
      await updateEmployee.mutateAsync({ ...data, id: selectedEmployee.id });
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await deleteEmployee.mutateAsync(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="space-y-8">
      <EmployeeHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
      
      <div className="space-y-4">
        <EmployeeSearch 
          search={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {filteredEmployees?.length === 0 && !isLoading ? (
        <EmptyEmployeeState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredEmployees || []}
          isLoading={isLoading}
          meta={{
            onEdit: (employee: Employee) => {
              setSelectedEmployee(employee);
              setIsEditDialogOpen(true);
            },
            onDelete: (employee: Employee) => {
              setSelectedEmployee(employee);
              setIsDeleteDialogOpen(true);
            },
            onView: (employee: Employee) => {
              setSelectedEmployee(employee);
              setIsViewDialogOpen(true);
            },
          }}
        />
      )}

      <EmployeeDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        selectedEmployee={selectedEmployee}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
