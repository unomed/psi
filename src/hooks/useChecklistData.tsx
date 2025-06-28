
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
        .insert(template)
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
      const { data, error } = await supabase
        .from('checklist_templates')
        .update(template)
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
      const newTemplate = {
        ...template,
        title: `${template.title} (Cópia)`,
        is_standard: false,
        derived_from_id: template.id
      };
      delete (newTemplate as any).id;
      
      const { data, error } = await supabase
        .from('checklist_templates')
        .insert(newTemplate)
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
