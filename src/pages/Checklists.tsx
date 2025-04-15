
import { useState } from "react";
import { PlusCircle, Copy, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTabs } from "@/components/checklists/ChecklistTabs";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";
import { 
  fetchChecklistTemplates, 
  fetchAssessmentResults, 
  saveChecklistTemplate, 
  copyTemplateForCompany,
  updateChecklistTemplate,
  deleteChecklistTemplate
} from "@/services/checklistService";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export default function Checklists() {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("templates");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);

  const { 
    data: checklists = [], 
    isLoading: isLoadingChecklists,
    refetch: refetchChecklists
  } = useQuery({
    queryKey: ['checklists'],
    queryFn: fetchChecklistTemplates
  });

  const { 
    data: results = [], 
    isLoading: isLoadingResults,
    refetch: refetchResults
  } = useQuery({
    queryKey: ['assessmentResults'],
    queryFn: fetchAssessmentResults
  });

  const handleCreateTemplate = async (data: Omit<ChecklistTemplate, "id" | "createdAt">) => {
    try {
      const isSuperAdmin = await hasRole('superadmin');
      await saveChecklistTemplate(data, isSuperAdmin);
      setIsFormDialogOpen(false);
      toast.success("Modelo de checklist criado com sucesso!");
      refetchChecklists();
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Erro ao criar modelo de checklist.");
    }
  };

  const handleEditTemplate = async (template: ChecklistTemplate) => {
    if (template.isStandard && !(await hasRole('superadmin'))) {
      toast.error("Apenas superadmins podem editar modelos padrão.");
      return;
    }
    
    if (template.companyId && template.companyId !== user?.id) {
      toast.error("Você só pode editar seus próprios modelos.");
      return;
    }

    try {
      await updateChecklistTemplate(template.id, template);
      toast.success("Modelo de checklist atualizado com sucesso!");
      refetchChecklists();
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Erro ao atualizar modelo de checklist.");
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

  const handleViewResult = (result: ChecklistResult) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklists</h1>
          <p className="text-muted-foreground mt-2">
            Modelos de avaliação psicossocial e questionários para identificação de riscos.
          </p>
        </div>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Checklist
        </Button>
      </div>
      
      {isLoadingChecklists || isLoadingResults ? (
        <div className="flex justify-center p-8">
          <p>Carregando...</p>
        </div>
      ) : (
        <ChecklistTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          checklists={checklists}
          results={results}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onCopyTemplate={handleCopyTemplate}
          onStartAssessment={() => {}} // Empty function as we're not using this feature
          onViewResult={handleViewResult}
          onCreateTemplate={() => setIsFormDialogOpen(true)}
        />
      )}
      
      <ChecklistDialogs
        isFormDialogOpen={isFormDialogOpen}
        setIsFormDialogOpen={setIsFormDialogOpen}
        isAssessmentDialogOpen={false}
        setIsAssessmentDialogOpen={() => {}}
        isResultDialogOpen={isResultDialogOpen}
        setIsResultDialogOpen={setIsResultDialogOpen}
        selectedTemplate={selectedTemplate}
        selectedResult={selectedResult}
        onSubmitTemplate={handleCreateTemplate}
        onSubmitAssessment={() => {}}
        onCloseAssessment={() => {}}
        onCloseResult={() => {
          setIsResultDialogOpen(false);
          setSelectedResult(null);
        }}
      />
    </div>
  );
}
