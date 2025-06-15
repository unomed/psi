
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Employee, EmployeeFormData } from "@/types/employee";

export function useEmployees() {
  const { userRole } = useAuth();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      let query = supabase
        .from('employees')
        .select(`
          id,
          name,
          email,
          cpf,
          phone,
          birth_date,
          gender,
          address,
          start_date,
          status,
          special_conditions,
          photo_url,
          company_id,
          role_id,
          sector_id,
          employee_type,
          employee_tags,
          created_at,
          updated_at,
          roles(name, required_tags),
          sectors(name)
        `);

      const { data, error } = await query.order('name');
      
      if (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }
      
      // Transform data to match Employee interface
      return (data || []).map(emp => ({
        ...emp,
        employee_tags: Array.isArray(emp.employee_tags) ? emp.employee_tags : [],
        role: emp.roles ? {
          id: emp.role_id,
          name: emp.roles.name,
          required_tags: Array.isArray(emp.roles.required_tags) ? emp.roles.required_tags : []
        } : undefined
      })) as Employee[];
    }
  });

  const createEmployee = useMutation({
    mutationFn: async (employeeData: EmployeeFormData) => {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          name: employeeData.name,
          cpf: employeeData.cpf,
          email: employeeData.email,
          phone: employeeData.phone,
          birth_date: employeeData.birth_date,
          gender: employeeData.gender,
          address: employeeData.address,
          start_date: employeeData.start_date,
          status: employeeData.status,
          special_conditions: employeeData.special_conditions,
          photo_url: employeeData.photo_url,
          company_id: employeeData.company_id,
          sector_id: employeeData.sector_id,
          role_id: employeeData.role_id,
          employee_type: employeeData.employee_type,
          employee_tags: employeeData.employee_tags
        })
        .select()
        .single();

      if (error) {
        toast.error('Erro ao criar funcionário');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário criado com sucesso');
    },
  });

  const updateEmployee = useMutation({
    mutationFn: async (employeeData: EmployeeFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('employees')
        .update({
          name: employeeData.name,
          cpf: employeeData.cpf,
          email: employeeData.email,
          phone: employeeData.phone,
          birth_date: employeeData.birth_date,
          gender: employeeData.gender,
          address: employeeData.address,
          start_date: employeeData.start_date,
          status: employeeData.status,
          special_conditions: employeeData.special_conditions,
          photo_url: employeeData.photo_url,
          company_id: employeeData.company_id,
          sector_id: employeeData.sector_id,
          role_id: employeeData.role_id,
          employee_type: employeeData.employee_type,
          employee_tags: employeeData.employee_tags
        })
        .eq('id', employeeData.id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar funcionário');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário atualizado com sucesso');
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        toast.error('Erro ao excluir funcionário');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário excluído com sucesso');
    },
  });

  return {
    employees,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
}
