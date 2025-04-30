
import { useQuery } from "@tanstack/react-query";
import { ChecklistTemplate } from "@/types/checklist";
import { 
  fetchChecklistTemplates, 
  updateChecklistTemplate,
  deleteChecklistTemplate,
  copyTemplateForCompany,
  saveChecklistTemplate 
} from "@/services/checklist";
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
      // Usando apenas o ID e os campos a serem atualizados
      const result = await updateChecklistTemplate(template.id, {
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
      
      // Para superadmins, permitir excluir qualquer template
      if (isSuperAdmin) {
        console.log("SuperAdmin excluindo template:", template.id);
        await deleteChecklistTemplate(template.id);
        toast.success("Modelo de checklist excluído com sucesso!");
        await refetchChecklists();
        return true;
      }
      
      // Para usuários não superadmin, verificar permissões
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
