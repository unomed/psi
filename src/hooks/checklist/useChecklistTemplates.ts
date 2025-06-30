
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate } from "@/types";
import { toast } from "sonner";

export function useChecklistOperations() {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: async (data: Omit<ChecklistTemplate, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from('checklist_templates')
        .insert([{
          title: data.title || data.name,
          description: data.description,
          type: data.type,
          scale_type: data.scale_type,
          is_active: data.is_active,
          is_standard: data.is_standard,
          estimated_time_minutes: data.estimated_time_minutes,
          company_id: data.company_id,
          created_by: data.created_by,
          cutoff_scores: data.cutoff_scores,
          instructions: data.instructions,
          interpretation_guide: data.interpretation_guide,
          max_score: data.max_score
        }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
      toast.success('Template criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast.error('Erro ao criar template');
    }
  });

  const updateTemplate = useMutation({
    mutationFn: async (data: ChecklistTemplate) => {
      const { data: result, error } = await supabase
        .from('checklist_templates')
        .update({
          title: data.title || data.name,
          description: data.description,
          type: data.type,
          scale_type: data.scale_type,
          is_active: data.is_active,
          is_standard: data.is_standard,
          estimated_time_minutes: data.estimated_time_minutes,
          cutoff_scores: data.cutoff_scores,
          instructions: data.instructions,
          interpretation_guide: data.interpretation_guide,
          max_score: data.max_score
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
      toast.success('Template atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      toast.error('Erro ao atualizar template');
    }
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('checklist_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
      toast.success('Template excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast.error('Erro ao excluir template');
    }
  });

  return {
    createTemplate: createTemplate.mutateAsync,
    updateTemplate: updateTemplate.mutateAsync,
    deleteTemplate: deleteTemplate.mutateAsync,
    isDeleting: deleteTemplate.isPending
  };
}
