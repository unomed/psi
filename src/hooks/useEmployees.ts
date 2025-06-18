
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  company_id: string;
  role_id: string;
  sector_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: { name: string };
  sectors?: { name: string };
}

interface UseEmployeesProps {
  companyId?: string | null;
  sectorId?: string | null;
  roleId?: string | null;
  searchQuery?: string | null;
}

export function useEmployees({ companyId, sectorId, roleId, searchQuery }: UseEmployeesProps = {}) {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['employees', companyId, sectorId, roleId, searchQuery, user?.id],
    queryFn: async (): Promise<Employee[]> => {
      if (!companyId && user?.role !== 'superadmin') {
        console.warn("Company ID is missing for non-superadmin user. Returning empty employee list.");
        return [];
      }

      let queryBuilder = supabase
        .from('employees')
        .select(`
          *,
          roles:role_id(name),
          sectors:sector_id(name)
        `)
        .eq('status', 'active');

      if (companyId) {
        queryBuilder = queryBuilder.eq('company_id', companyId);
      }

      if (sectorId) {
        queryBuilder = queryBuilder.eq('sector_id', sectorId);
      }

      if (roleId) {
        queryBuilder = queryBuilder.eq('role_id', roleId);
      }

      if (searchQuery) {
        queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }

      return data?.map(emp => ({
        ...emp,
        role: emp.roles,
        sectors: emp.sectors
      })) || [];
    },
  });

  return {
    employees: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    ...query
  };
}
