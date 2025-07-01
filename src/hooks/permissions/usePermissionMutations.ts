
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePermissionMutations() {
  const queryClient = useQueryClient();

  const updatePermission = useMutation({
    mutationFn: async ({ 
      roleId, 
      permissions, 
      role 
    }: { 
      roleId: string; 
      permissions: Record<string, boolean>;
      role?: string; // Make role optional to support updating the role name
    }) => {
      // Create an update object that may include the role name
      const updateData: { 
        permissions: Record<string, boolean>; 
        role?: string;
      } = { permissions };
      
      // Only add role to the update if it's provided
      if (role) {
        updateData.role = role;
      }
      
      const { error } = await supabase
        .from('permission_settings')
        .update(updateData)
        .eq('id', roleId);

      if (error) {
        toast.error('Erro ao atualizar permissões');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permissões atualizadas com sucesso');
    }
  });

  const createRole = useMutation({
    mutationFn: async ({ role, permissions }: { role: string, permissions: Record<string, boolean> }) => {
      const { error } = await supabase
        .from('permission_settings')
        .insert({ role, permissions });

      if (error) {
        toast.error('Erro ao criar perfil');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Perfil criado com sucesso');
    }
  });

  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('permission_settings')
        .delete()
        .eq('id', roleId);

      if (error) {
        toast.error('Erro ao excluir perfil');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Perfil excluído com sucesso');
    }
  });

  return {
    updatePermission,
    createRole,
    deleteRole
  };
}
