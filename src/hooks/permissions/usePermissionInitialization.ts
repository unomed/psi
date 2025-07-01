
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Permission } from "../usePermissions";
import { createDefaultPermissions } from "./defaultPermissions";

export function usePermissionInitialization() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      console.log("Fetching permissions from database");
      const { data, error } = await supabase
        .from('permission_settings')
        .select('*')
        .order('role');

      if (error) {
        console.error('Error loading permissions:', error);
        toast.error('Erro ao carregar permissões');
        throw error;
      }

      console.log("Permissions data from DB:", data);
      
      if (data.length === 0) {
        console.log("No permissions found, initializing defaults");
        await initializeDefaultPermissions();
        const { data: newData, error: newError } = await supabase
          .from('permission_settings')
          .select('*')
          .order('role');
          
        if (newError) {
          console.error('Error loading default permissions:', newError);
          toast.error('Erro ao carregar permissões padrão');
          throw newError;
        }
        
        console.log("Default permissions initialized:", newData);
        return newData as Permission[];
      }

      return data as Permission[];
    },
  });
}

async function initializeDefaultPermissions() {
  console.log("Initializing default permissions");
  const defaultPermissions = createDefaultPermissions();
  
  for (const permission of defaultPermissions) {
    console.log(`Creating permission for role: ${permission.role}`);
    const { error } = await supabase
      .from('permission_settings')
      .insert(permission);
      
    if (error) {
      console.error(`Error creating permission for role ${permission.role}:`, error);
    }
  }
}
