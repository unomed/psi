
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRoles() {
  const queryClient = useQueryClient();

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

  const createRole = useMutation({
    mutationFn: async (roleData: any) => {
      const { data, error } = await supabase
        .from('roles')
        .insert({
          name: roleData.name,
          description: roleData.description,
          company_id: roleData.companyId,
          sector_id: roleData.sectorId,
          required_skills: roleData.requiredSkills,
          risk_level: roleData.riskLevel
        })
        .select()
        .single();

      if (error) {
        toast.error('Erro ao criar função');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Função criada com sucesso');
    },
  });

  const updateRole = useMutation({
    mutationFn: async (roleData: any) => {
      const { data, error } = await supabase
        .from('roles')
        .update({
          name: roleData.name,
          description: roleData.description,
          company_id: roleData.companyId,
          sector_id: roleData.sectorId,
          required_skills: roleData.requiredSkills,
          risk_level: roleData.riskLevel
        })
        .eq('id', roleData.id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar função');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Função atualizada com sucesso');
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        toast.error('Erro ao excluir função');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Função excluída com sucesso');
    },
  });

  return { 
    roles: roles || [], 
    isLoading,
    createRole,
    updateRole,
    deleteRole
  };
}
