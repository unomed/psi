
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRoles() {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Erro ao carregar funções');
        throw error;
      }
      
      // Transform database response to match expected interface
      return data.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        companyId: role.company_id,
        sectorId: role.sector_id,
        requiredSkills: role.required_skills,
        riskLevel: role.risk_level,
        createdAt: new Date(role.created_at),
        updatedAt: new Date(role.updated_at)
      }));
    }
  });

  return { roles: roles || [], isLoading };
}
