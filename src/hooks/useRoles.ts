
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RoleData } from "@/components/roles/RoleCard";

export const useRoles = () => {
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("name");

      if (error) {
        toast.error("Erro ao carregar funções");
        throw error;
      }

      return data.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        sectorId: role.sector_id,
        companyId: role.company_id,
        requiredSkills: role.required_skills || [],
        riskLevel: role.risk_level
      })) as RoleData[];
    },
  });

  const createRole = useMutation({
    mutationFn: async (newRole: Omit<RoleData, "id">) => {
      const { data, error } = await supabase
        .from("roles")
        .insert([{
          name: newRole.name,
          description: newRole.description,
          sector_id: newRole.sectorId,
          company_id: newRole.companyId,
          required_skills: newRole.requiredSkills,
          risk_level: newRole.riskLevel
        }])
        .select()
        .single();

      if (error) {
        toast.error("Erro ao criar função");
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        sectorId: data.sector_id,
        companyId: data.company_id,
        requiredSkills: data.required_skills || [],
        riskLevel: data.risk_level
      } as RoleData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Função criada com sucesso!");
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("roles")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Erro ao deletar função");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Função removida com sucesso!");
    },
  });

  return {
    roles,
    isLoading,
    createRole,
    deleteRole,
  };
};
