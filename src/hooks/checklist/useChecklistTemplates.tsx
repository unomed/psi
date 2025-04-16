
import { useQuery } from "@tanstack/react-query";
import { ChecklistTemplate } from "@/types/checklist";
import { 
  fetchChecklistTemplates, 
  updateChecklistTemplate,
  deleteChecklistTemplate,
  copyTemplateForCompany,
  saveChecklistTemplate 
} from "@/services/checklistService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
    if (template.isStandard && !(await hasRole('superadmin'))) {
      toast.error("Apenas superadmins podem editar modelos padrão.");
      return false;
    }
    
    if (template.companyId && template.companyId !== user?.id) {
      toast.error("Você só pode editar seus próprios modelos.");
      return false;
    }

    try {
      await updateChecklistTemplate(template.id, template);
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
    if (template.isStandard && !(await hasRole('superadmin'))) {
      toast.error("Apenas superadmins podem excluir modelos padrão.");
      return;
    }
    
    if (template.companyId && template.companyId !== user?.id) {
      toast.error("Você só pode excluir seus próprios modelos.");
      return;
    }

    try {
      await deleteChecklistTemplate(template.id);
      toast.success("Modelo de checklist excluído com sucesso!");
      refetchChecklists();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Erro ao excluir modelo de checklist.");
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
