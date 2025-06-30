
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types";

export function useEmployees(companyId?: string) {
  return useQuery({
    queryKey: ['employees', companyId],
    queryFn: async (): Promise<Employee[]> => {
      let query = supabase
        .from('employees')
        .select(`
          *,
          roles!inner(id, name, risk_level, required_tags),
          sectors!inner(id, name)
        `)
        .order('name');

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }

      return (data || []).map(emp => ({
        ...emp,
        role: Array.isArray(emp.roles) ? emp.roles[0] : emp.roles,
        sectors: Array.isArray(emp.sectors) ? emp.sectors[0] : emp.sectors,
        employee_type: emp.employee_type as 'funcionario' | 'candidato',
        employee_tags: Array.isArray(emp.employee_tags) 
          ? emp.employee_tags.map(tag => String(tag)).filter(Boolean)
          : []
      }));
    },
    enabled: !!companyId
  });
}
