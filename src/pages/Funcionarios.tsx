
import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeeHeader } from "@/components/employees/EmployeeHeader";
import { EmployeeDialogs } from "@/components/employees/dialogs/EmployeeDialogs";
import { TagManagementDialog } from "@/components/employees/dialogs/TagManagementDialog";
import { EmployeeListSection } from "@/components/employees/EmployeeListSection";
import { useEmployeeOperations } from "@/hooks/employees/useEmployeeOperations";
import { useEmployeesWithMood } from "@/hooks/useEmployeesWithMood";
import { useCompany } from "@/contexts/CompanyContext";

export default function Funcionarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTagManagementOpen, setIsTagManagementOpen] = useState(false);
  
  const { selectedCompanyId } = useCompany();
  const { employees, isLoading } = useEmployees();
  
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedEmployee,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleViewClick
  } = useEmployeeOperations(selectedCompanyId);

  // Filtrar funcionários por empresa
  const filteredByCompany = selectedCompanyId 
    ? employees?.filter(employee => employee.company_id === selectedCompanyId)
    : [];

  const filteredEmployees = filteredByCompany?.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = employee.name.toLowerCase().includes(searchLower);
    const matchesCpf = employee.cpf.toLowerCase().includes(searchLower);
    const matchesEmail = employee.email?.toLowerCase().includes(searchLower) || false;
    
    return matchesName || matchesCpf || matchesEmail;
  });

  // Hook para buscar dados de humor dos funcionários
  const { employeeMoods, loading: moodLoading } = useEmployeesWithMood(filteredByCompany);

  return (
    <div className="space-y-8">
      <EmployeeHeader 
        onCreateClick={handleCreateClick}
        onManageTagsClick={() => setIsTagManagementOpen(true)}
      />
      
      {!selectedCompanyId ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Selecione uma empresa no cabeçalho para visualizar os funcionários</p>
        </div>
      ) : (
        <EmployeeListSection
          filteredEmployees={filteredEmployees}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateClick={handleCreateClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          employeeMoods={employeeMoods}
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
        companyId={selectedCompanyId}
      />

      <TagManagementDialog
        open={isTagManagementOpen}
        onOpenChange={setIsTagManagementOpen}
      />
    </div>
  );
}
