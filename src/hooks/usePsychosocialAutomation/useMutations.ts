
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PsychosocialAutomationConfig } from "./types";

export function useConfigMutation(companyId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newConfig: Partial<PsychosocialAutomationConfig>) => {
      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .upsert({
          company_id: companyId!,
          ...newConfig
        }, { onConflict: 'company_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialAutomationConfig'] });
      toast.success('Configurações de automação atualizadas com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar configurações de automação');
    }
  });
}

export function useProcessAssessmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentResponseId: string) => {
      const { data, error } = await supabase.rpc('process_psychosocial_assessment_auto', {
        p_assessment_response_id: assessmentResponseId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialProcessingLogs'] });
      queryClient.invalidateQueries({ queryKey: ['psychosocialNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['psychosocialProcessingStats'] });
      toast.success('Processamento iniciado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao iniciar processamento');
    }
  });
}

export function useMarkNotificationSentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('psychosocial_notifications')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialNotifications'] });
      toast.success('Notificação marcada como enviada');
    },
    onError: () => {
      toast.error('Erro ao atualizar notificação');
    }
  });
}
