
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
          roles:role_id (
            id,
            name,
            risk_level,
            required_tags
          ),
          sectors:sector_id (
            id,
            name
          )
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

      return (data || []).map(item => ({
        ...item,
        role: Array.isArray(item.roles) ? item.roles[0] : item.roles,
        sectors: Array.isArray(item.sectors) ? item.sectors[0] : item.sectors
      }));
    },
    enabled: !!companyId
  });
}
