
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Employee } from "@/types/employee";

interface UseEmployeesParams {
  companyId?: string;
}

export function useEmployees(params: UseEmployeesParams = {}) {
  const { userCompanies, userRole } = useAuth();
  
  const query = useQuery({
    queryKey: ['employees', params.companyId],
    queryFn: async (): Promise<Employee[]> => {
      let query = supabase
        .from('employees')
        .select(`
          *,
          role:roles(id, name, risk_level, required_tags),
          sectors(id, name)
        `);

      // Apply company filter
      if (params.companyId) {
        query = query.eq('company_id', params.companyId);
      } else if (userRole !== 'superadmin' && userCompanies.length > 0) {
        const companyIds = userCompanies.map(uc => uc.companyId);
        query = query.in('company_id', companyIds);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }

      return (data || []).map(emp => ({
        id: emp.id,
        name: emp.name,
        cpf: emp.cpf,
        email: emp.email,
        phone: emp.phone,
        birth_date: emp.birth_date,
        gender: emp.gender,
        address: emp.address,
        start_date: emp.start_date,
        status: emp.status,
        special_conditions: emp.special_conditions,
        photo_url: emp.photo_url,
        company_id: emp.company_id,
        sector_id: emp.sector_id,
        role_id: emp.role_id,
        employee_type: emp.employee_type || 'funcionario',
        employee_tags: emp.employee_tags || [],
        role: emp.role,
        sectors: emp.sectors,
        created_at: emp.created_at,
        updated_at: emp.updated_at
      }));
    },
    enabled: userRole === 'superadmin' || userCompanies.length > 0,
  });

  return {
    employees: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
