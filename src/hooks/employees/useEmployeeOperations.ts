import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Employee } from "@/types";

export function useEmployeeOperations(selectedCompany?: string) {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const createEmployees = useMutation({
    mutationFn: async (employees: any[]) => {
      // Garantir que todos os campos obrigatórios estão presentes
      const employeesData = employees.map(emp => ({
        company_id: emp.company_id,
        sector_id: emp.sector_id,
        role_id: emp.role_id,
        name: emp.name,
        email: emp.email,
        cpf: emp.cpf,
        start_date: emp.start_date || new Date().toISOString().split('T')[0],
        status: emp.status || 'active',
        employee_type: 'funcionario' as const,
        employee_tags: emp.employee_tags || []
      }));

      const { data, error } = await supabase
        .from('employees')
        .insert(employeesData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionários criados com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar funcionários:', error);
      toast.error(`Erro ao criar funcionários: ${error.message}`);
    }
  });

  const updateEmployee = useMutation({
    mutationFn: async (employee: Employee) => {
      const { data, error } = await supabase
        .from('employees')
        .update({
          name: employee.name,
          email: employee.email,
          cpf: employee.cpf,
          phone: employee.phone,
          birth_date: employee.birth_date,
          gender: employee.gender,
          address: employee.address,
          start_date: employee.start_date,
          status: employee.status,
          special_conditions: employee.special_conditions,
          photo_url: employee.photo_url,
          sector_id: employee.sector_id,
          role_id: employee.role_id,
          employee_type: employee.employee_type,
          employee_tags: employee.employee_tags
        })
        .eq('id', employee.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar funcionário:', error);
      toast.error(`Erro ao atualizar funcionário: ${error.message}`);
    }
  });

  const deleteEmployee = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário excluído com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao excluir funcionário:', error);
      toast.error(`Erro ao excluir funcionário: ${error.message}`);
    }
  });

  const handleCreateClick = () => {
    setSelectedEmployee(null);
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

  const handleCreate = async (employeeData: any) => {
    try {
      await createEmployees.mutateAsync([employeeData]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handleEdit = async (employeeData: Employee) => {
    try {
      await updateEmployee.mutateAsync(employeeData);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedEmployee) {
      try {
        await deleteEmployee.mutateAsync(selectedEmployee.id);
        setIsDeleteDialogOpen(false);
        setSelectedEmployee(null);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return {
    // Estados dos diálogos
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
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleViewClick,
    handleCreate,
    handleEdit,
    handleDelete,
    
    // Mutations
    createEmployees: createEmployees.mutate,
    isCreating: createEmployees.isPending
  };
}
