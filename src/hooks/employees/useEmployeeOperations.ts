
import { useState } from "react";
import { Employee, EmployeeFormData } from "@/types/employee";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { toast } from "sonner";

export function useEmployeeOperations(selectedCompany: string | null) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { userRole } = useAuth();
  const { verifyCompanyAccess } = useCompanyAccessCheck();
  const { createEmployee, updateEmployee, deleteEmployee } = useEmployees();

  const handleCreate = async (data: EmployeeFormData) => {
    if (!selectedCompany) {
      toast.error("Selecione uma empresa primeiro");
      return;
    }
    
    try {
      // Garantir que o funcionário seja criado na empresa selecionada
      await createEmployee.mutateAsync({
        ...data,
        company_id: selectedCompany
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const handleEdit = async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;
    
    // Verificar se o usuário tem acesso à empresa do funcionário
    if (userRole !== 'superadmin') {
      const hasAccess = await verifyCompanyAccess(selectedEmployee.company_id);
      if (!hasAccess) {
        toast.error('Você não tem permissão para editar este funcionário');
        return;
      }
    }
    
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
    
    // Verificar se o usuário tem acesso à empresa do funcionário
    if (userRole !== 'superadmin') {
      const hasAccess = await verifyCompanyAccess(selectedEmployee.company_id);
      if (!hasAccess) {
        toast.error('Você não tem permissão para excluir este funcionário');
        return;
      }
    }
    
    try {
      await deleteEmployee.mutateAsync(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleCreateClick = () => {
    if (!selectedCompany) {
      toast.error("Selecione uma empresa primeiro");
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleViewClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  return {
    // Dialog states
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedEmployee,
    
    // Handlers
    handleCreate,
    handleEdit,
    handleDelete,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleViewClick
  };
}
