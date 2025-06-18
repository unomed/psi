import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface ActionPlan {
  id: string;
  company_id: string;
  assessment_response_id?: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  responsible_user_id?: string;
  sector_id?: string;
  sector_name?: string;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  progress_percentage: number;
  risk_level?: 'low' | 'medium' | 'high';
  budget_allocated?: number;
  budget_used?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionPlanItem {
  id: string;
  action_plan_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  responsible_name?: string;
  responsible_email?: string;
  sector_id?: string;
  estimated_hours?: number;
  actual_hours?: number;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  progress_percentage: number;
  dependencies?: string[];
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useActionPlans() {
  const queryClient = useQueryClient();
  const { user, userCompanies } = useAuth();

  const { data: actionPlans, isLoading } = useQuery({
    queryKey: ['actionPlans'],
    queryFn: async () => {
      console.log('Fetching action plans...');
      const { data, error } = await supabase.rpc('get_action_plans');
      
      if (error) {
        console.error('Error fetching action plans:', error);
        toast.error('Erro ao carregar planos de ação');
        throw error;
      }
      
      console.log('Action plans fetched successfully:', data?.length || 0);
      return (data || []) as ActionPlan[];
    }
  });

  const createActionPlan = useMutation({
    mutationFn: async (planData: Partial<ActionPlan>) => {
      // Se não tem company_id, usar a primeira empresa do usuário
      const companyId = planData.company_id || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);
      
      if (!companyId) {
        throw new Error('É necessário estar associado a uma empresa para criar planos de ação');
      }

      const { data, error } = await supabase
        .from('action_plans')
        .insert({
          title: planData.title,
          description: planData.description,
          status: planData.status || 'draft',
          priority: planData.priority || 'medium',
          company_id: companyId,
          sector_id: planData.sector_id,
          responsible_user_id: planData.responsible_user_id,
          start_date: planData.start_date,
          due_date: planData.due_date,
          risk_level: planData.risk_level,
          budget_allocated: planData.budget_allocated,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating action plan:', error);
        toast.error('Erro ao criar plano de ação');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
      toast.success('Plano de ação criado com sucesso');
    },
  });

  const updateActionPlan = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ActionPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('action_plans')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          sector_id: updates.sector_id,
          responsible_user_id: updates.responsible_user_id,
          start_date: updates.start_date,
          due_date: updates.due_date,
          completion_date: updates.completion_date,
          risk_level: updates.risk_level,
          budget_allocated: updates.budget_allocated,
          budget_used: updates.budget_used
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating action plan:', error);
        toast.error('Erro ao atualizar plano de ação');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
      toast.success('Plano de ação atualizado com sucesso');
    },
  });

  const deleteActionPlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('action_plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting action plan:', error);
        toast.error('Erro ao excluir plano de ação');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
      toast.success('Plano de ação excluído com sucesso');
    },
  });

  return {
    actionPlans: actionPlans || [],
    isLoading,
    createActionPlan,
    updateActionPlan,
    deleteActionPlan,
  };
}
