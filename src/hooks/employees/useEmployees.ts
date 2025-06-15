
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  company_id: string;
  role_id: string;
  sector_id: string;
  status: string;
  roles?: {
    name: string;
  };
  sectors?: {
    name: string;
  };
}

interface UseEmployeesProps {
  companyId?: string;
}

export function useEmployees({ companyId }: UseEmployeesProps = {}) {
  const { userRole } = useAuth();

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees', companyId],
    queryFn: async (): Promise<Employee[]> => {
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
          roles(name),
          sectors(name)
        `)
        .eq('status', 'active');

      if (companyId && userRole !== 'superadmin') {
        query = query.eq('company_id', companyId);
      }

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
