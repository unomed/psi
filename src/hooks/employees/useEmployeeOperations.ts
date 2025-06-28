
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Employee, EmployeeFormData } from "@/types/employee";

export function useEmployeeOperations(companyId?: string) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const { data: result, error } = await supabase
        .from('employees')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', companyId] });
      toast.success('Funcionário criado com sucesso!');
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error('Erro ao criar funcionário: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmployeeFormData> }) => {
      const { data: result, error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', companyId] });
      toast.success('Funcionário atualizado com sucesso!');
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar funcionário: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', companyId] });
      toast.success('Funcionário deletado com sucesso!');
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    },
    onError: (error: any) => {
      toast.error('Erro ao deletar funcionário: ' + error.message);
    }
  });

  const handleCreate = (data: EmployeeFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: EmployeeFormData) => {
    if (selectedEmployee) {
      updateMutation.mutate({ id: selectedEmployee.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedEmployee) {
      deleteMutation.mutate(selectedEmployee.id);
    }
  };

  const handleCreateClick = () => {
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
    handleViewClick,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
