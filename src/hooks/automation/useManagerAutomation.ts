
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AutomationRule, ManagerNotification, EscalationLevel } from "@/types/automation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ManagerAutomationService } from "@/services/automation/managerAutomationService";

export function useManagerAutomation(companyId?: string) {
  const queryClient = useQueryClient();
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Buscar regras de automação
  const { 
    data: automationRules = [], 
    isLoading: rulesLoading 
  } = useQuery({
    queryKey: ['automationRules', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId
  });

  // Buscar notificações de gestores
  const { 
    data: managerNotifications = [], 
    isLoading: notificationsLoading 
  } = useQuery({
    queryKey: ['managerNotifications', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('manager_notifications')
        .select(`
          *,
          manager:employees(name, email)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId
  });

  // Buscar níveis de escalação
  const { 
    data: escalationLevels = [], 
    isLoading: escalationLoading 
  } = useQuery({
    queryKey: ['escalationLevels', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('escalation_levels')
        .select('*')
        .eq('company_id', companyId)
        .order('level', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId
  });

  // Criar regra de automação
  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('automation_rules')
        .insert({
          ...ruleData,
          company_id: companyId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
      toast.success("Regra de automação criada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error creating automation rule:", error);
      toast.error("Erro ao criar regra de automação");
    }
  });

  // Atualizar regra de automação
  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AutomationRule> }) => {
      const { data, error } = await supabase
        .from('automation_rules')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
      toast.success("Regra de automação atualizada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error updating automation rule:", error);
      toast.error("Erro ao atualizar regra de automação");
    }
  });

  // Excluir regra de automação
  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
      toast.success("Regra de automação excluída com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error deleting automation rule:", error);
      toast.error("Erro ao excluir regra de automação");
    }
  });

  // Marcar notificação como lida
  const markNotificationReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('manager_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerNotifications'] });
    },
    onError: (error: any) => {
      console.error("Error marking notification as read:", error);
      toast.error("Erro ao marcar notificação como lida");
    }
  });

  // Processar trigger de automação
  const processAutomationTrigger = async (
    triggerType: string,
    entityData: any
  ) => {
    if (!companyId) return;

    try {
      await ManagerAutomationService.processAutomationTrigger(
        triggerType,
        entityData,
        companyId
      );
      
      // Invalidar queries para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['managerNotifications'] });
    } catch (error) {
      console.error("Error processing automation trigger:", error);
    }
  };

  return {
    // Dados
    automationRules,
    managerNotifications,
    escalationLevels,
    selectedRule,
    setSelectedRule,
    
    // Estados de loading
    isLoading: rulesLoading || notificationsLoading || escalationLoading,
    rulesLoading,
    notificationsLoading,
    escalationLoading,
    
    // Mutations
    createRule: createRuleMutation.mutateAsync,
    updateRule: updateRuleMutation.mutateAsync,
    deleteRule: deleteRuleMutation.mutateAsync,
    markNotificationRead: markNotificationReadMutation.mutateAsync,
    
    // Funções
    processAutomationTrigger,
    
    // Estados das mutations
    isCreating: createRuleMutation.isPending,
    isUpdating: updateRuleMutation.isPending,
    isDeleting: deleteRuleMutation.isPending
  };
}
