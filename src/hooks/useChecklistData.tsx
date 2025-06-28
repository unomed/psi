
import { useChecklistTemplates } from "./checklist/useChecklistTemplates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistTemplate } from "@/types";

export function useChecklistData() {
  const queryClient = useQueryClient();
  const { checklists, isLoading, error, refetch } = useChecklistTemplates();

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<ChecklistTemplate, 'id'>) => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .insert({
          title: template.title,
          description: template.description,
          type: template.type,
          scale_type: template.scale_type,
          is_active: template.is_active,
          is_standard: template.is_standard,
          derived_from_id: template.derived_from_id,
          company_id: template.company_id,
          instructions: template.instructions,
          estimated_time_minutes: template.estimated_time_minutes,
          interpretation_guide: template.interpretation_guide,
          cutoff_scores: template.cutoff_scores,
          max_score: template.max_score,
          version: template.version,
          created_by: template.created_by
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistTemplates'] });
      toast.success('Template criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar template: ' + error.message);
    }
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, template }: { id: string; template: Partial<ChecklistTemplate> }) => {
      const updateData: Record<string, any> = {};
      
      if (template.title) updateData.title = template.title;
      if (template.description) updateData.description = template.description;
      if (template.type) updateData.type = template.type;
      if (template.scale_type) updateData.scale_type = template.scale_type;
      if (template.is_active !== undefined) updateData.is_active = template.is_active;
      if (template.is_standard !== undefined) updateData.is_standard = template.is_standard;
      if (template.derived_from_id) updateData.derived_from_id = template.derived_from_id;
      if (template.company_id) updateData.company_id = template.company_id;
      if (template.instructions) updateData.instructions = template.instructions;
      if (template.estimated_time_minutes) updateData.estimated_time_minutes = template.estimated_time_minutes;
      if (template.interpretation_guide) updateData.interpretation_guide = template.interpretation_guide;
      if (template.cutoff_scores) updateData.cutoff_scores = template.cutoff_scores;
      if (template.max_score) updateData.max_score = template.max_score;
      if (template.version) updateData.version = template.version;
      if (template.created_by) updateData.created_by = template.created_by;
      
      const { data, error } = await supabase
        .from('checklist_templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistTemplates'] });
      toast.success('Template atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar template: ' + error.message);
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
      toast.success('Template deletado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao deletar template: ' + error.message);
    }
  });

  const copyTemplate = useMutation({
    mutationFn: async (template: ChecklistTemplate) => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .insert({
          title: `${template.title} (Cópia)`,
          description: template.description,
          type: template.type,
          scale_type: template.scale_type,
          is_active: template.is_active,
          is_standard: false,
          derived_from_id: template.id,
          company_id: template.company_id,
          instructions: template.instructions,
          estimated_time_minutes: template.estimated_time_minutes,
          interpretation_guide: template.interpretation_guide,
          cutoff_scores: template.cutoff_scores,
          max_score: template.max_score,
          version: template.version,
          created_by: template.created_by
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistTemplates'] });
      toast.success('Template copiado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao copiar template: ' + error.message);
    }
  });

  return {
    checklists,
    isLoading,
    error,
    refetch,
    handleCreateTemplate: createTemplate.mutate,
    handleUpdateTemplate: updateTemplate.mutate,
    handleDeleteTemplate: deleteTemplate.mutate,
    handleCopyTemplate: copyTemplate.mutate,
    refetchChecklists: refetch
  };
}
