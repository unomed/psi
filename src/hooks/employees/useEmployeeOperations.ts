import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  company_id: string;
  role_id: string;
  sector_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: { name: string };
  sectors?: { name: string };
}

interface UseEmployeeOperationsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useEmployeeOperations({ onSuccess, onError }: UseEmployeeOperationsProps = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createEmployeeMutation = useMutation({
    mutationFn: async (newEmployee: Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'role' | 'sectors'>) => {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('employees')
        .insert([
          {
            ...newEmployee,
            company_id: user?.user_metadata?.companyId,
          }
        ]);

      if (error) {
        console.error("Error creating employee:", error);
        toast.error(`Erro ao criar funcionário: ${error.message}`);
        onError?.(error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      setIsCreating(false);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Funcionário criado com sucesso!");
      onSuccess?.();
    },
    onError: (error: any) => {
      setIsCreating(false);
      console.error("Error creating employee:", error);
      toast.error(`Erro ao criar funcionário: ${error.message}`);
      onError?.(error);
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async (updatedEmployee: Employee) => {
      setIsUpdating(true);
      const { data, error } = await supabase
        .from('employees')
        .update({
          ...updatedEmployee,
        })
        .eq('id', updatedEmployee.id);

      if (error) {
        console.error("Error updating employee:", error);
        toast.error(`Erro ao atualizar funcionário: ${error.message}`);
        onError?.(error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Funcionário atualizado com sucesso!");
      onSuccess?.();
    },
    onError: (error: any) => {
      setIsUpdating(false);
      console.error("Error updating employee:", error);
      toast.error(`Erro ao atualizar funcionário: ${error.message}`);
      onError?.(error);
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      setIsDeleting(true);
      const { data, error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error("Error deleting employee:", error);
        toast.error(`Erro ao excluir funcionário: ${error.message}`);
        onError?.(error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Funcionário excluído com sucesso!");
      onSuccess?.();
    },
    onError: (error: any) => {
      setIsDeleting(false);
      console.error("Error deleting employee:", error);
      toast.error(`Erro ao excluir funcionário: ${error.message}`);
      onError?.(error);
    },
  });

  return {
    createEmployee: createEmployeeMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutateAsync,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
