import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RoleRequiredTag } from "@/types/tags";

export function useRoleRequiredTagsManager() {
  const queryClient = useQueryClient();

  // Adicionar tag obrigatória para uma função
  const addRequiredTagToRole = useMutation({
    mutationFn: async ({ roleId, tagTypeId }: { roleId: string; tagTypeId: string }) => {
      const { data, error } = await supabase
        .from('role_required_tags')
        .insert({
          role_id: roleId,
          tag_type_id: tagTypeId,
          is_mandatory: true
        })
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-required-tags'] });
      toast.success('Tag obrigatória adicionada com sucesso');
    },
    onError: (error: any) => {
      console.error("Error adding required tag to role:", error);
      toast.error(error.message.includes('duplicate') 
        ? 'Esta tag já é obrigatória para esta função' 
        : 'Erro ao adicionar tag obrigatória'
      );
    }
  });

  // Remover tag obrigatória de uma função
  const removeRequiredTagFromRole = useMutation({
    mutationFn: async (requiredTagId: string) => {
      const { error } = await supabase
        .from('role_required_tags')
        .delete()
        .eq('id', requiredTagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-required-tags'] });
      toast.success('Tag obrigatória removida com sucesso');
    },
    onError: (error: any) => {
      console.error("Error removing required tag from role:", error);
      toast.error('Erro ao remover tag obrigatória');
    }
  });

  // Verificar se funcionário tem todas as tags obrigatórias da função
  const checkEmployeeCompliance = useMutation({
    mutationFn: async ({ employeeId, roleId }: { employeeId: string; roleId: string }) => {
      // Buscar tags obrigatórias da função
      const { data: requiredTags, error: reqError } = await supabase
        .from('role_required_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('role_id', roleId)
        .eq('is_mandatory', true);

      if (reqError) throw reqError;

      // Buscar tags do funcionário
      const { data: employeeTags, error: empError } = await supabase
        .from('employee_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('employee_id', employeeId);

      if (empError) throw empError;

      // Verificar quais tags estão faltando
      const employeeTagTypeIds = employeeTags?.map(et => et.tag_type_id) || [];
      const missingTags = requiredTags?.filter(rt => 
        !employeeTagTypeIds.includes(rt.tag_type_id)
      ) || [];

      // Verificar tags expiradas
      const expiredTags = employeeTags?.filter(et => 
        et.expiry_date && new Date(et.expiry_date) < new Date()
      ) || [];

      return {
        requiredTags: requiredTags || [],
        employeeTags: employeeTags || [],
        missingTags,
        expiredTags,
        isCompliant: missingTags.length === 0 && expiredTags.length === 0,
        compliancePercentage: requiredTags?.length > 0 
          ? ((requiredTags.length - missingTags.length) / requiredTags.length) * 100 
          : 100
      };
    }
  });

  // Sincronizar tags obrigatórias com funcionários de uma função
  const syncRoleRequiredTags = useMutation({
    mutationFn: async (roleId: string) => {
      // Buscar todos os funcionários desta função
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, name, role_id')
        .eq('role_id', roleId)
        .eq('status', 'active');

      if (empError) throw empError;

      // Para cada funcionário, verificar compliance
      const complianceResults = [];
      
      for (const employee of employees || []) {
        try {
          const result = await checkEmployeeCompliance.mutateAsync({
            employeeId: employee.id,
            roleId: roleId
          });
          
          complianceResults.push({
            employee,
            ...result
          });
        } catch (error) {
          console.error(`Error checking compliance for employee ${employee.id}:`, error);
        }
      }

      return {
        totalEmployees: employees?.length || 0,
        complianceResults,
        overallCompliance: complianceResults.length > 0 
          ? complianceResults.reduce((acc, r) => acc + r.compliancePercentage, 0) / complianceResults.length
          : 100
      };
    },
    onSuccess: (result) => {
      toast.success(`Sincronização concluída: ${result.overallCompliance.toFixed(1)}% de compliance`);
    },
    onError: (error: any) => {
      console.error("Error syncing role required tags:", error);
      toast.error('Erro ao sincronizar tags obrigatórias');
    }
  });

  return {
    addRequiredTagToRole,
    removeRequiredTagFromRole,
    checkEmployeeCompliance,
    syncRoleRequiredTags
  };
}