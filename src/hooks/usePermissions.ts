
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppRole } from "@/types";

export interface Permission {
  id: string;
  role: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export function usePermissions() {
  const queryClient = useQueryClient();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permission_settings')
        .select('*')
        .order('role');

      if (error) {
        toast.error('Erro ao carregar permissões');
        throw error;
      }

      // If no permission data exists yet, create default permissions
      if (data.length === 0) {
        await initializeDefaultPermissions();
        const { data: newData, error: newError } = await supabase
          .from('permission_settings')
          .select('*')
          .order('role');
          
        if (newError) {
          toast.error('Erro ao carregar permissões padrão');
          throw newError;
        }
        
        return newData as Permission[];
      }

      return data as Permission[];
    },
  });

  const initializeDefaultPermissions = async () => {
    const defaultPermissions = [
      {
        role: 'superadmin',
        permissions: createFullPermissions(true)
      },
      {
        role: 'admin',
        permissions: createAdminPermissions()
      },
      {
        role: 'evaluator',
        permissions: createEvaluatorPermissions()
      },
      {
        role: 'user',
        permissions: createUserPermissions()
      }
    ];

    for (const permission of defaultPermissions) {
      await supabase
        .from('permission_settings')
        .insert(permission);
    }
  };

  const updatePermission = useMutation({
    mutationFn: async ({ roleId, permissions }: { roleId: string, permissions: Record<string, boolean> }) => {
      const { error } = await supabase
        .from('permission_settings')
        .update({ permissions })
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
    permissions,
    isLoading,
    updatePermission,
    createRole,
    deleteRole
  };
}

// Helper functions to create default permissions
function createFullPermissions(value: boolean): Record<string, boolean> {
  return {
    // Dashboard
    view_dashboard: value,
    
    // Companies
    view_companies: value,
    create_companies: value,
    edit_companies: value,
    delete_companies: value,
    
    // Employees
    view_employees: value,
    create_employees: value,
    edit_employees: value,
    delete_employees: value,
    
    // Sectors
    view_sectors: value,
    create_sectors: value,
    edit_sectors: value,
    delete_sectors: value,
    
    // Functions/Roles
    view_functions: value,
    create_functions: value,
    edit_functions: value,
    delete_functions: value,
    
    // Checklists
    view_checklists: value,
    create_checklists: value,
    edit_checklists: value,
    delete_checklists: value,
    
    // Assessments
    view_assessments: value,
    create_assessments: value,
    edit_assessments: value,
    delete_assessments: value,
    
    // Reports
    view_reports: value,
    export_reports: value,
    
    // Settings
    view_settings: value,
    edit_settings: value,
  };
}

function createAdminPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(true);
  permissions.edit_settings = false;
  return permissions;
}

function createEvaluatorPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(false);
  
  // What evaluators can access
  permissions.view_dashboard = true;
  permissions.view_checklists = true;
  permissions.view_assessments = true;
  permissions.create_assessments = true;
  permissions.edit_assessments = true;
  
  return permissions;
}

function createUserPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(false);
  
  // Basic user permissions
  permissions.view_dashboard = true;
  
  return permissions;
}
