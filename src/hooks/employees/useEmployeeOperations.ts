
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEmployeeOperations() {
  const queryClient = useQueryClient();

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

  return {
    createEmployees: createEmployees.mutate,
    isCreating: createEmployees.isPending
  };
}
