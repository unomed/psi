
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  start_date: string;
  status: string;
  special_conditions?: string;
  photo_url?: string;
  employee_type: 'funcionario' | 'candidato';
  employee_tags: any[];
  company_id: string;
  sector_id: string;
  role_id: string;
  created_at: string;
  updated_at: string;
}

export function useEmployees(companyId?: string) {
  return useQuery({
    queryKey: ['employees', companyId],
    queryFn: async (): Promise<Employee[]> => {
      let query = supabase
        .from('employees')
        .select('*')
        .order('name');

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
      }

      // Garantir tipagem correta
      return (data || []).map(emp => ({
        ...emp,
        employee_type: (emp.employee_type === 'candidato' ? 'candidato' : 'funcionario') as 'funcionario' | 'candidato',
        employee_tags: emp.employee_tags || []
      }));
    },
    enabled: true
  });
}
