
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AutomationRule, ManagerNotification, EscalationLevel } from "@/types/automation";
import { toast } from "sonner";

export function useManagerAutomation(companyId?: string) {
  const queryClient = useQueryClient();
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Mock automation rules data
  const { 
    data: automationRules = [], 
    isLoading: rulesLoading 
  } = useQuery({
    queryKey: ['automationRules', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      // Return mock data with proper types
      return [
        {
          id: '1',
          name: 'Alerta de Alto Risco',
          description: 'Notifica gestores quando risco alto é detectado',
          isActive: true,
          companyId: companyId,
          triggerType: 'risk_detected' as const,
          priority: 'high' as const,
          conditions: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Prazo de Avaliação',
          description: 'Lembra gestores sobre prazos próximos',
          isActive: true,
          companyId: companyId,
          triggerType: 'deadline_approaching' as const,
          priority: 'medium' as const,
          conditions: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    },
    enabled: !!companyId
  });

  // Mock manager notifications data
  const { 
    data: managerNotifications = [], 
    isLoading: notificationsLoading 
  } = useQuery({
    queryKey: ['managerNotifications', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      // Return mock data with proper types
      return [
        {
          id: '1',
          managerId: 'manager1',
          type: 'high_risk_alert' as const,
          priority: 'high' as const,
          title: 'Alto Risco Detectado',
          message: 'Foi detectado um alto risco para o funcionário João Silva',
          relatedEntityType: 'assessment' as const,
          relatedEntityId: 'assessment1',
          isRead: false,
          actionRequired: true,
          createdAt: new Date(),
          metadata: {
            automationGenerated: true
          }
        },
        {
          id: '2',
          managerId: 'manager1',
          type: 'deadline_reminder' as const,
          priority: 'medium' as const,
          title: 'Prazo de Avaliação Próximo',
          message: 'A avaliação psicossocial vence em 3 dias',
          relatedEntityType: 'assessment' as const,
          relatedEntityId: 'assessment2',
          isRead: true,
          actionRequired: false,
          createdAt: new Date(),
          metadata: {}
        }
      ];
    },
    enabled: !!companyId
  });

  // Mock escalation levels data
  const { 
    data: escalationLevels = [], 
    isLoading: escalationLoading 
  } = useQuery({
    queryKey: ['escalationLevels', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      // Return mock data with proper types
      return [
        {
          id: '1',
          name: 'Supervisores',
          level: 1,
          roleIds: [],
          userIds: [],
          notificationMethods: ['email', 'in_app'] as const,
          escalationDelayMinutes: 60
        },
        {
          id: '2',
          name: 'Gerentes',
          level: 2,
          roleIds: [],
          userIds: [],
          notificationMethods: ['email', 'sms', 'in_app'] as const,
          escalationDelayMinutes: 120
        }
      ];
    },
    enabled: !!companyId
  });

  // Create automation rule mutation
  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Creating automation rule:', ruleData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        id: Date.now().toString(), 
        ...ruleData, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
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

  // Update automation rule mutation
  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AutomationRule> }) => {
      console.log('Updating automation rule:', id, updates);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  // Delete automation rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      console.log('Deleting automation rule:', ruleId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  // Mark notification as read mutation
  const markNotificationReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('Marking notification as read:', notificationId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerNotifications'] });
    },
    onError: (error: any) => {
      console.error("Error marking notification as read:", error);
      toast.error("Erro ao marcar notificação como lida");
    }
  });

  // Process automation trigger function
  const processAutomationTrigger = async (
    triggerType: string,
    entityData: any
  ) => {
    if (!companyId) return;

    try {
      console.log('Processing automation trigger:', triggerType, entityData);
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['managerNotifications'] });
      
      toast.success("Trigger de automação processado com sucesso!");
    } catch (error) {
      console.error("Error processing automation trigger:", error);
      toast.error("Erro ao processar trigger de automação");
    }
  };

  return {
    // Data
    automationRules,
    managerNotifications,
    escalationLevels,
    selectedRule,
    setSelectedRule,
    
    // Loading states
    isLoading: rulesLoading || notificationsLoading || escalationLoading,
    rulesLoading,
    notificationsLoading,
    escalationLoading,
    
    // Mutations
    createRule: createRuleMutation.mutateAsync,
    updateRule: updateRuleMutation.mutateAsync,
    deleteRule: deleteRuleMutation.mutateAsync,
    markNotificationRead: markNotificationReadMutation.mutateAsync,
    
    // Functions
    processAutomationTrigger,
    
    // Mutation states
    isCreating: createRuleMutation.isPending,
    isUpdating: updateRuleMutation.isPending,
    isDeleting: deleteRuleMutation.isPending
  };
}
