
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationSettings {
  id: string;
  email_notifications: boolean;
  system_notifications: boolean;
  risk_alerts: boolean;
  deadline_alerts: boolean;
}

export interface NotificationSettingsForm {
  emailNotifications: boolean;
  systemNotifications: boolean;
  riskAlerts: boolean;
  deadlineAlerts: boolean;
}

export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching notification settings:', error);
        return null;
      }

      return data;
    }
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (formValues: NotificationSettingsForm) => {
      const newSettings = {
        email_notifications: formValues.emailNotifications,
        system_notifications: formValues.systemNotifications,
        risk_alerts: formValues.riskAlerts,
        deadline_alerts: formValues.deadlineAlerts
      };

      const { data, error } = await supabase
        .from('notification_settings')
        .upsert({
          ...newSettings,
          ...(settings?.id ? { id: settings.id } : {})
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
      toast.success('Configurações de notificações atualizadas com sucesso');
    },
    onError: (error) => {
      console.error('Error updating notification settings:', error);
      toast.error('Erro ao atualizar as configurações de notificações');
    }
  });

  return {
    settings,
    isLoading,
    updateSettings
  };
}
