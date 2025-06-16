
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeData {
  id: string;
  name: string;
  birth_date: string | null;
  company_id: string;
}

export function useEmployeeData(employeeId: string | null) {
  return useQuery({
    queryKey: ['employee-data', employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, birth_date, company_id')
        .eq('id', employeeId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do funcionário:', error);
        throw error;
      }

      return data as EmployeeData;
    },
    enabled: !!employeeId,
  });
}
