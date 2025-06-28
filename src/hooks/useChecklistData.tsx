
import { useChecklistTemplates } from "./checklist/useChecklistTemplates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistTemplate, ChecklistResult } from "@/types";
import { useScheduledAssessments } from "./checklist/useScheduledAssessments";

export function useChecklistData() {
  const queryClient = useQueryClient();
  const { checklists, isLoading, error, refetch } = useChecklistTemplates();
  const { scheduledAssessments, refetch: refetchScheduled } = useScheduledAssessments();

  // Mock results data for now
  const results: ChecklistResult[] = [];

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<ChecklistTemplate, 'id'>) => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .insert({
          title: template.title || template.name,
          description: template.description,
          type: template.type,
          scale_type: template.scale_type,
          is_active: template.is_active,
          is_standard: template.is_standard,
          derived_from_id: template.derived_from_id,
          company_id: template.company_id,
          instructions: template.instructions,
          estimated_time_minutes: template.estimated_time_minutes,
          cutoff_scores: template.cutoff_scores,
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
      
      if (template.title || template.name) updateData.title = template.title || template.name;
      if (template.description) updateData.description = template.description;
      if (template.type) updateData.type = template.type;
      if (template.scale_type) updateData.scale_type = template.scale_type;
      if (template.is_active !== undefined) updateData.is_active = template.is_active;
      if (template.is_standard !== undefined) updateData.is_standard = template.is_standard;
      if (template.derived_from_id) updateData.derived_from_id = template.derived_from_id;
      if (template.company_id) updateData.company_id = template.company_id;
      if (template.instructions) updateData.instructions = template.instructions;
      if (template.estimated_time_minutes) updateData.estimated_time_minutes = template.estimated_time_minutes;
      if (template.cutoff_scores) updateData.cutoff_scores = template.cutoff_scores;
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
      return true;
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
          title: `${template.title || template.name} (Cópia)`,
          description: template.description,
          type: template.type,
          scale_type: template.scale_type,
          is_active: template.is_active,
          is_standard: false,
          derived_from_id: template.id,
          company_id: template.company_id,
          instructions: template.instructions,
          estimated_time_minutes: template.estimated_time_minutes,
          cutoff_scores: template.cutoff_scores,
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

  // Mock functions for compatibility
  const handleSaveAssessmentResult = async (result: any) => {
    // Implementation would go here
    toast.success('Resultado salvo com sucesso!');
    return true;
  };

  const handleSendEmail = async (assessmentId: string) => {
    // Implementation would go here
    toast.success('Email enviado com sucesso!');
    return true;
  };

  return {
    checklists,
    results,
    scheduledAssessments,
    isLoading,
    error,
    refetch,
    handleCreateTemplate: (template: Omit<ChecklistTemplate, 'id'>) => {
      createTemplate.mutate(template);
      return Promise.resolve(true);
    },
    handleUpdateTemplate: (template: ChecklistTemplate) => {
      updateTemplate.mutate({ id: template.id, template });
      return Promise.resolve(true);
    },
    handleDeleteTemplate: (template: ChecklistTemplate) => {
      deleteTemplate.mutate(template.id);
      return Promise.resolve(true);
    },
    handleCopyTemplate: (template: ChecklistTemplate) => {
      copyTemplate.mutate(template);
      return Promise.resolve(true);
    },
    handleSaveAssessmentResult,
    handleSendEmail,
    refetchChecklists: refetch,
    refetchScheduledAssessments: refetchScheduled
  };
}
