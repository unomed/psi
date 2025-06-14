
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ActionPlan {
  id: string;
  company_id: string;
  assessment_response_id?: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  responsible_user_id?: string;
  department?: string;
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
  department?: string;
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

  const { data: actionPlans, isLoading } = useQuery({
    queryKey: ['actionPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Erro ao carregar planos de ação');
        throw error;
      }
      
      return data as ActionPlan[];
    }
  });

  const createActionPlan = useMutation({
    mutationFn: async (planData: Partial<ActionPlan>) => {
      const { data, error } = await supabase
        .from('action_plans')
        .insert(planData)
        .select()
        .single();

      if (error) {
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
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
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
