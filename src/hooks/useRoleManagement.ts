import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Role {
  id: string;
  name: string;
  description?: string;
  companyId: string;
}

export function useRoleManagement(companyId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getRoles = useQuery({
    queryKey: ['roles', companyId],
    queryFn: async () => {
      if (!companyId && user?.role !== 'superadmin') {
        console.warn("Company ID is missing for non-superadmin user. Returning empty role list.");
        return [];
      }

      let queryBuilder = supabase
        .from('roles')
        .select('*');

      if (companyId) {
        queryBuilder = queryBuilder.eq('company_id', companyId);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Error fetching roles:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!companyId || user?.role === 'superadmin',
  });

  const createRole = useMutation({
    mutationFn: async (newRole: Omit<Role, 'id'>) => {
      const { data, error } = await supabase
        .from('roles')
        .insert([newRole]);

      if (error) {
        console.error("Error creating role:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', companyId] });
      toast.success("Role created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Error creating role: ${error.message}`);
    },
  });

  const updateRole = useMutation({
    mutationFn: async (updatedRole: Role) => {
      const { data, error } = await supabase
        .from('roles')
        .update(updatedRole)
        .eq('id', updatedRole.id);

      if (error) {
        console.error("Error updating role:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', companyId] });
      toast.success("Role updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Error updating role: ${error.message}`);
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting role:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', companyId] });
      toast.success("Role deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(`Error deleting role: ${error.message}`);
    },
  });

  return {
    roles: getRoles.data || [],
    isLoading: getRoles.isLoading,
    error: getRoles.error,
    createRole: createRole.mutateAsync,
    updateRole: updateRole.mutateAsync,
    deleteRole: deleteRole.mutateAsync,
  };
}
