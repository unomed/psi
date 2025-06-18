import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

interface Employee {
  id: string;
  full_name: string;
  email: string;
  company_id: string;
  role_id: string;
  sector_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UseEmployeesProps {
  companyId?: string | null;
  sectorId?: string | null;
  roleId?: string | null;
  searchQuery?: string | null;
}

export function useEmployees({ companyId, sectorId, roleId, searchQuery }: UseEmployeesProps = {}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['employees', companyId, sectorId, roleId, searchQuery, user?.id],
    queryFn: async (): Promise<Employee[]> => {
      if (!companyId && user?.role !== 'superadmin') {
        console.warn("Company ID is missing for non-superadmin user. Returning empty employee list.");
        return [];
      }

      let query = supabase
        .from('employees')
        .select('*')
        .eq('is_active', true);

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      if (sectorId) {
        query = query.eq('sector_id', sectorId);
      }

      if (roleId) {
        query = query.eq('role_id', roleId);
      }

      if (searchQuery) {
        query = query.ilike('full_name', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }

      return data || [];
    },
  });
}
