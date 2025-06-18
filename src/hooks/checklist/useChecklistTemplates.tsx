
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistTemplate } from "@/types/checklist";
import { useAuth } from '@/hooks/useAuth';

async function fetchChecklistTemplates(): Promise<ChecklistTemplate[]> {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching checklist templates:", error);
    throw error;
  }

  return data || [];
}

async function saveChecklistTemplate(data: Omit<ChecklistTemplate, "id" | "createdAt">, isSuperAdmin: boolean) {
  const { error } = await supabase
    .from('checklist_templates')
    .insert([data]);

  if (error) {
    throw error;
  }
}

async function updateChecklistTemplate(id: string, data: Partial<ChecklistTemplate>) {
  const { error } = await supabase
    .from('checklist_templates')
    .update(data)
    .eq('id', id);

  if (error) {
    throw error;
  }
}

async function deleteChecklistTemplate(id: string) {
  const { error } = await supabase
    .from('checklist_templates')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

async function copyTemplateForCompany(templateId: string, companyId: string, newTitle: string) {
  const { error } = await supabase
    .rpc('copy_template_for_company', {
      template_id: templateId,
      company_id: companyId,
      new_title: newTitle
    });

  if (error) {
    throw error;
  }
}

export function useChecklistTemplates() {
  const { user, hasRole } = useAuth();

  const { 
    data: checklists = [], 
    isLoading,
    refetch: refetchChecklists
  } = useQuery({
    queryKey: ['checklists'],
    queryFn: fetchChecklistTemplates
  });

  const handleCreateTemplate = async (data: Omit<ChecklistTemplate, "id" | "createdAt">) => {
    try {
      const isSuperAdmin = await hasRole('superadmin');
      await saveChecklistTemplate(data, isSuperAdmin);
      toast.success("Modelo de checklist criado com sucesso!");
      refetchChecklists();
      return true;
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Erro ao criar modelo de checklist.");
      return false;
    }
  };

  const handleUpdateTemplate = async (template: ChecklistTemplate) => {
    try {
      const isSuperAdmin = await hasRole('superadmin');
      
      if (template.isStandard && !isSuperAdmin) {
        toast.error("Apenas superadmins podem editar modelos padrão.");
        return false;
      }
      
      if (template.companyId && template.companyId !== user?.id && !isSuperAdmin) {
        toast.error("Você só pode editar seus próprios modelos.");
        return false;
      }

      console.log("Atualizando template:", template);
      await updateChecklistTemplate(template.id, {
        title: template.title,
        description: template.description,
        type: template.type,
        scaleType: template.scaleType,
        questions: template.questions
      });
      
      toast.success("Modelo de checklist atualizado com sucesso!");
      refetchChecklists();
      return true;
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Erro ao atualizar modelo de checklist.");
      return false;
    }
  };

  const handleDeleteTemplate = async (template: ChecklistTemplate) => {
    try {
      const isSuperAdmin = await hasRole('superadmin');
      
      if (isSuperAdmin) {
        console.log("SuperAdmin excluindo template:", template.id);
        await deleteChecklistTemplate(template.id);
        toast.success("Modelo de checklist excluído com sucesso!");
        await refetchChecklists();
        return true;
      }
      
      if (template.isStandard) {
        toast.error("Apenas superadmins podem excluir modelos padrão.");
        return false;
      }
      
      if (template.companyId && template.companyId !== user?.id) {
        toast.error("Você só pode excluir seus próprios modelos.");
        return false;
      }

      console.log("Usuário excluindo template:", template.id);
      await deleteChecklistTemplate(template.id);
      
      toast.success("Modelo de checklist excluído com sucesso!");
      await refetchChecklists();
      return true;
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir modelo de checklist.");
      return false;
    }
  };

  const handleCopyTemplate = async (template: ChecklistTemplate) => {
    if (!user?.id) {
      toast.error("Você precisa estar logado para copiar um modelo.");
      return;
    }

    try {
      await copyTemplateForCompany(
        template.id, 
        user.id, 
        `Cópia de ${template.title}`
      );
      toast.success("Modelo copiado com sucesso!");
      refetchChecklists();
    } catch (error) {
      console.error("Error copying template:", error);
      toast.error("Erro ao copiar modelo.");
    }
  };

  return {
    checklists,
    isLoading,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    refetchChecklists
  };
}
