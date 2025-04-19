
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Permission } from "../usePermissions";
import { createDefaultPermissions } from "./defaultPermissions";

export function usePermissionInitialization() {
  return useQuery({
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
}

async function initializeDefaultPermissions() {
  const defaultPermissions = createDefaultPermissions();
  
  for (const permission of defaultPermissions) {
    await supabase
      .from('permission_settings')
      .insert(permission);
  }
}
