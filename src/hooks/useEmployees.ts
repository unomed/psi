
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useEmployees() {
  const { userRole } = useAuth();

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
          company_id,
          role_id,
          sector_id,
          status,
          employee_type,
          employee_tags,
          roles(name, required_tags),
          sectors(name)
        `);

      const { data, error } = await query.order('name');
      
      if (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }
      
      return data || [];
    }
  });

  return {
    employees,
    isLoading,
    error
  };
}
