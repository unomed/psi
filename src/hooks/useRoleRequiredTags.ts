
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { RoleRequiredTag } from "@/types/tags";

export function useRoleRequiredTags(roleId: string | null) {
  const { data: requiredTags = [], isLoading } = useQuery({
    queryKey: ['role-required-tags', roleId],
    queryFn: async (): Promise<RoleRequiredTag[]> => {
      if (!roleId) return [];
      
      console.log("[useRoleRequiredTags] Buscando tags obrigatórias para função:", roleId);
      
      const { data, error } = await supabase
        .from('role_required_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('role_id', roleId);

      if (error) {
        console.error("Error fetching role required tags:", error);
        throw error;
      }

      console.log("[useRoleRequiredTags] Tags obrigatórias encontradas:", data);
      return data || [];
    },
    enabled: !!roleId
  });

  return {
    requiredTags,
    isLoading
  };
}
