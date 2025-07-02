
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationSettings {
  id: string;
  email_notifications: boolean;
  system_notifications: boolean;
  risk_alerts: boolean;
  deadline_alerts: boolean;
  last_notification_sent?: string;
  notification_frequency?: string;
  company_id?: string;
  high_risk_threshold?: number;
  deadline_warning_days?: number;
}

export interface NotificationSettingsForm {
  emailNotifications: boolean;
  systemNotifications: boolean;
  riskAlerts: boolean;
  deadlineAlerts: boolean;
  notificationFrequency?: string;
  highRiskThreshold?: number;
  deadlineWarningDays?: number;
}

export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching notification settings:', error);
        return null;
      }

      // Se não há configurações, retorna valores padrão
      if (!data) {
        return {
          id: '',
          email_notifications: true,
          system_notifications: true,
          risk_alerts: true,
          deadline_alerts: true,
          notification_frequency: 'daily',
          high_risk_threshold: 80,
          deadline_warning_days: 7
        };
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
        deadline_alerts: formValues.deadlineAlerts,
        notification_frequency: formValues.notificationFrequency,
        high_risk_threshold: formValues.highRiskThreshold,
        deadline_warning_days: formValues.deadlineWarningDays
      };

      const { data, error } = await supabase
        .from('notification_settings')
        .upsert({
          ...newSettings,
          ...(settings?.id ? { id: settings.id } : {}),
          updated_at: new Date().toISOString()
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
