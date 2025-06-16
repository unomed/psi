
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AutomationRule, ManagerNotification, EscalationLevel } from "@/types/automation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ManagerAutomationService } from "@/services/automation/managerAutomationService";

export function useManagerAutomation(companyId?: string) {
  const queryClient = useQueryClient();
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Buscar regras de automação (usando tabela existing ou mock data)
  const { 
    data: automationRules = [], 
    isLoading: rulesLoading 
  } = useQuery({
    queryKey: ['automationRules', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      // Como não temos tabela ainda, retornar dados mock
      return [
        {
          id: '1',
          name: 'Alerta de Alto Risco',
          description: 'Notifica gestores quando risco alto é detectado',
          isActive: true,
          triggerType: 'risk_detected',
          priority: 'high',
          conditions: [],
          actions: []
        }
      ];
    },
    enabled: !!companyId
  });

  // Buscar notificações de gestores (usar dados mock por enquanto)
  const { 
    data: managerNotifications = [], 
    isLoading: notificationsLoading 
  } = useQuery({
    queryKey: ['managerNotifications', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      // Mock data
      return [
        {
          id: '1',
          managerId: 'manager1',
          type: 'high_risk_alert',
          priority: 'high',
          title: 'Alto Risco Detectado',
          message: 'Foi detectado um alto risco para o funcionário João Silva',
          relatedEntityType: 'assessment',
          relatedEntityId: 'assessment1',
          isRead: false,
          actionRequired: true,
          createdAt: new Date()
        }
      ];
    },
    enabled: !!companyId
  });

  // Buscar níveis de escalação (usar dados mock)
  const { 
    data: escalationLevels = [], 
    isLoading: escalationLoading 
  } = useQuery({
    queryKey: ['escalationLevels', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      // Mock data
      return [
        {
          id: '1',
          name: 'Supervisores',
          level: 1,
          roleIds: [],
          userIds: [],
          notificationMethods: ['email', 'in_app'],
          escalationDelayMinutes: 60
        }
      ];
    },
    enabled: !!companyId
  });

  // Criar regra de automação
  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Creating automation rule:', ruleData);
      // Por enquanto só log, futuramente integrar com backend
      return { id: Date.now().toString(), ...ruleData, createdAt: new Date(), updatedAt: new Date() };
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
      console.log('Updating automation rule:', id, updates);
      // Por enquanto só log, futuramente integrar com backend
      return { id, ...updates };
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
      console.log('Deleting automation rule:', ruleId);
      // Por enquanto só log, futuramente integrar com backend
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
      console.log('Marking notification as read:', notificationId);
      // Por enquanto só log, futuramente integrar com backend
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
