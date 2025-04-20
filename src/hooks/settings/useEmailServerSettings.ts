
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailServerSettings {
  id: string;
  smtp_server: string;
  smtp_port: number;
  username: string;
  password: string;
  sender_email: string;
  sender_name: string;
}

export function useEmailServerSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['emailServerSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_server_settings')
        .select('*')
        .maybeSingle(); // Use maybeSingle() to handle no results

      if (error) {
        console.error('Error fetching email server settings:', error);
        return null;
      }

      return data;
    }
  });

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: async (newSettings: Omit<EmailServerSettings, 'id'>) => {
      // Get current user to ensure they're logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Você precisa estar autenticado para atualizar as configurações.');
      }
      
      const { data, error } = await supabase
        .from('email_server_settings')
        .upsert({
          ...newSettings,
          ...(settings?.id ? { id: settings.id } : {})
        });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailServerSettings'] });
      toast.success('Configurações do servidor de email atualizadas com sucesso');
    },
    onError: (error) => {
      console.error('Error updating email server settings:', error);
      toast.error('Erro ao atualizar as configurações do servidor de email');
    }
  });

  const testConnection = async () => {
    // If there are no settings yet, return an error
    if (!settings) {
      throw new Error('Configurações de email não encontradas. Salve as configurações primeiro.');
    }

    // Get current user to ensure they're logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Você precisa estar autenticado para testar a conexão.');
    }

    const { data, error } = await supabase.functions.invoke('test-email-connection', {
      body: { settings }
    });

    if (error) {
      console.error('Error testing email connection:', error);
      throw new Error('Falha ao testar a conexão de email. Verifique os logs para detalhes.');
    }

    return data?.success || false;
  };

  return {
    settings,
    isLoading,
    isUpdating,
    updateSettings,
    testConnection
  };
}
