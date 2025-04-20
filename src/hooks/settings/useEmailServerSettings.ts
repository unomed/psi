
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
        .single();

      if (error) {
        console.error('Error fetching email server settings:', error);
        return null;
      }

      return data;
    }
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (newSettings: Omit<EmailServerSettings, 'id'>) => {
      const { data, error } = await supabase
        .from('email_server_settings')
        .upsert({
          ...newSettings,
          ...(settings?.id ? { id: settings.id } : {})
        });

      if (error) throw error;
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
    const { error } = await supabase.functions.invoke('test-email-connection', {
      body: { settings }
    });

    if (error) {
      throw new Error('Failed to test email connection');
    }

    return true;
  };

  return {
    settings,
    isLoading,
    updateSettings,
    testConnection
  };
}
