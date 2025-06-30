
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate } from "@/types";
import { toast } from "sonner";

export function useChecklistTemplates() {
  const { data: checklists, isLoading, error, refetch } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: async (): Promise<ChecklistTemplate[]> => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select(`
          *,
          questions(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklist templates:', error);
        throw error;
      }

      // Transform database response to match ChecklistTemplate interface
      return data?.map(template => ({
        id: template.id,
        name: template.title,
        title: template.title,
        description: template.description || '',
        category: 'default' as const,
        type: template.type === 'stress' ? 'custom' : (template.type as any),
        scale_type: template.scale_type as any || 'likert_5',
        is_standard: template.is_standard || false,
        is_active: template.is_active,
        estimated_time_minutes: template.estimated_time_minutes || 15,
        version: typeof template.version === 'string' ? parseInt(template.version) : (template.version || 1),
        created_at: template.created_at,
        updated_at: template.updated_at,
        company_id: template.company_id,
        created_by: template.created_by,
        cutoff_scores: template.cutoff_scores,
        derived_from_id: template.derived_from_id,
        instructions: template.instructions,
        questions: template.questions?.map((q: any) => ({
          id: q.id,
          template_id: q.template_id,
          question_text: q.question_text,
          text: q.question_text,
          order_number: q.order_number,
          created_at: q.created_at,
          updated_at: q.updated_at
        })) || []
      })) || [];
    }
  });

  return {
    checklists: checklists || [],
    isLoading,
    error,
    refetch
  };
}

export function useChecklistOperations() {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: async (data: Omit<ChecklistTemplate, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from('checklist_templates')
        .insert({
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
          instructions: data.instructions
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistTemplates'] });
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
          type: data.type === 'stress' ? 'custom' : data.type,
          scale_type: data.scale_type as any,
          is_active: data.is_active,
          is_standard: data.is_standard,
          estimated_time_minutes: data.estimated_time_minutes,
          cutoff_scores: data.cutoff_scores,
          instructions: data.instructions
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistTemplates'] });
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
      queryClient.invalidateQueries({ queryKey: ['checklistTemplates'] });
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
