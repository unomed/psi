
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
        .from('action_plan_items')
        .select('*')
        .eq('action_plan_id', actionPlanId)
        .order('created_at', { ascending: true });
      
      if (error) {
        toast.error('Erro ao carregar itens do plano');
        throw error;
      }
      
      return data as ActionPlanItem[];
    },
    enabled: !!actionPlanId
  });

  const createItem = useMutation({
    mutationFn: async (itemData: Partial<ActionPlanItem>) => {
      const { data, error } = await supabase
        .from('action_plan_items')
        .insert(itemData)
        .select()
        .single();

      if (error) {
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
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
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
