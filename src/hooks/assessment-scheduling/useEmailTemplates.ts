
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailTemplate } from "@/types";
import { 
  fetchEmailTemplates, 
  saveEmailTemplate, 
  updateEmailTemplate, 
  deleteEmailTemplate,
  createDefaultEmailTemplates 
} from "@/services/assessment/emailTemplateService";
import { toast } from "sonner";

export function useEmailTemplates() {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const { 
    data: templates = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: fetchEmailTemplates
  });

  const createTemplateMutation = useMutation({
    mutationFn: saveEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success("Template criado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error creating template:", error);
      toast.error("Erro ao criar template");
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EmailTemplate> }) => 
      updateEmailTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success("Template atualizado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error updating template:", error);
      toast.error("Erro ao atualizar template");
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success("Template excluído com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error deleting template:", error);
      toast.error("Erro ao excluir template");
    }
  });

  const createDefaultTemplatesMutation = useMutation({
    mutationFn: createDefaultEmailTemplates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success("Templates padrão criados com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error creating default templates:", error);
      toast.error("Erro ao criar templates padrão");
    }
  });

  const handleCreateTemplate = async (template: Omit<EmailTemplate, "id">) => {
    return createTemplateMutation.mutateAsync(template);
  };

  const handleUpdateTemplate = async (template: EmailTemplate) => {
    const { id, ...updates } = template;
    return updateTemplateMutation.mutateAsync({ id, updates });
  };

  const handleDeleteTemplate = async (templateId: string) => {
    return deleteTemplateMutation.mutateAsync(templateId);
  };

  const handleCreateDefaultTemplates = async () => {
    return createDefaultTemplatesMutation.mutateAsync();
  };

  const getTemplateByType = (type: string): EmailTemplate | undefined => {
    return templates.find(template => template.type === type);
  };

  return {
    templates,
    isLoading,
    error,
    selectedTemplate,
    setSelectedTemplate,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCreateDefaultTemplates,
    getTemplateByType,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending
  };
}
