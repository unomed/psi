
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Employee, EmployeeFormData } from "@/types/employee";
import { toast } from "sonner";

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Erro ao carregar funcionários');
        throw error;
      }
      
      return data as Employee[];
    }
  });

  const createEmployee = useMutation({
    mutationFn: async (newEmployee: EmployeeFormData) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(newEmployee)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('CPF já cadastrado');
        } else {
          toast.error('Erro ao criar funcionário');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário cadastrado com sucesso');
    }
  });

  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...data }: EmployeeFormData & { id: string }) => {
      const { error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id);

      if (error) {
        toast.error('Erro ao atualizar funcionário');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário atualizado com sucesso');
    }
  });

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Erro ao excluir funcionário');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário excluído com sucesso');
    }
  });

  return {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
}
