
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ActionPlanItem } from "./useActionPlans";

export function useActionPlanItems(actionPlanId?: string) {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['actionPlanItems', actionPlanId],
    queryFn: async () => {
      if (!actionPlanId) return [];
      
      const { data, error } = await supabase
        .rpc('get_action_plan_items', { plan_id: actionPlanId });
      
      if (error) {
        console.error('Error fetching action plan items:', error);
        toast.error('Erro ao carregar itens do plano');
        throw error;
      }
      
      return (data || []) as ActionPlanItem[];
    },
    enabled: !!actionPlanId
  });

  const createItem = useMutation({
    mutationFn: async (itemData: Partial<ActionPlanItem>) => {
      const { data, error } = await supabase
        .from('action_plan_items')
        .insert({
          action_plan_id: itemData.action_plan_id,
          title: itemData.title,
          description: itemData.description,
          status: itemData.status || 'pending',
          priority: itemData.priority || 'medium',
          responsible_name: itemData.responsible_name,
          responsible_email: itemData.responsible_email,
          sector_id: itemData.sector_id,
          estimated_hours: itemData.estimated_hours,
          start_date: itemData.start_date,
          due_date: itemData.due_date,
          notes: itemData.notes,
          created_by: itemData.created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating action plan item:', error);
        toast.error('Erro ao criar item do plano');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlanItems'] });
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
      toast.success('Item criado com sucesso');
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ActionPlanItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('action_plan_items')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          responsible_name: updates.responsible_name,
          responsible_email: updates.responsible_email,
          sector_id: updates.sector_id,
          estimated_hours: updates.estimated_hours,
          actual_hours: updates.actual_hours,
          start_date: updates.start_date,
          due_date: updates.due_date,
          completion_date: updates.completion_date,
          progress_percentage: updates.progress_percentage,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating action plan item:', error);
        toast.error('Erro ao atualizar item');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlanItems'] });
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
      toast.success('Item atualizado com sucesso');
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('action_plan_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting action plan item:', error);
        toast.error('Erro ao excluir item');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlanItems'] });
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
      toast.success('Item excluído com sucesso');
    },
  });

  return {
    items: items || [],
    isLoading,
    createItem,
    updateItem,
    deleteItem,
  };
}
