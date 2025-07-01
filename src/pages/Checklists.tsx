
import { useState } from "react";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTabs } from "@/components/checklists/ChecklistTabs";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";
import { ChecklistHeader } from "@/components/checklists/ChecklistHeader";
import { TemplatePreviewDialog } from "@/components/checklists/TemplatePreviewDialog";
import { useChecklistData } from "@/hooks/useChecklistData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Checklists() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    checklists = [],
    results = [],
    scheduledAssessments = [],
    isLoading,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    handleSaveAssessmentResult,
    handleSendEmail,
    refetchChecklists,
    refetch: refetchScheduled
  } = useChecklistData();

  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setIsFormDialogOpen(true);
  };

  const handleViewResult = (result: ChecklistResult) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  const handlePreviewTemplate = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleDelete = async (template: ChecklistTemplate) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const success = await handleDeleteTemplate(template);
      
      if (success) {
        // Refetch to ensure UI is updated
        await refetchChecklists();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitAssessment = async (resultData: any) => {
    if (!selectedTemplate) return;
    
    try {
      // Construir o objeto de resultado para salvar
      const assessmentResult = {
        templateId: selectedTemplate.id,
        employeeName: "Teste",
        employeeId: "",
        results: resultData.results,
        dominantFactor: resultData.dominantFactor,
        categorizedResults: resultData.categorizedResults || {},
        completedAt: new Date()
      };
      
      // Salvar o resultado
      await handleSaveAssessmentResult(assessmentResult);
      
      toast.success("Avaliação concluída com sucesso!");
      setIsAssessmentDialogOpen(false);
      
      // Atualizar para a aba de resultados para ver o resultado
      setActiveTab("results");
    } catch (error) {
      console.error("Erro ao salvar resultado da avaliação:", error);
      toast.error("Erro ao salvar avaliação. Tente novamente.");
    }
  };

  const handleSubmitTemplate = async (templateData: Omit<ChecklistTemplate, "id" | "createdAt"> | ChecklistTemplate) => {
    let success = false;
    
    if (isEditing && selectedTemplate) {
      // Atualizar template existente
      const updatedTemplate = {
        ...selectedTemplate,
        ...(templateData as Omit<ChecklistTemplate, "id" | "createdAt">)
      };
      success = await handleUpdateTemplate(updatedTemplate);
    } else {
      // Criar novo template
      success = await handleCreateTemplate(templateData as Omit<ChecklistTemplate, "id" | "createdAt">);
    }
    
    if (success) {
      handleCloseFormDialog();
    }
  };

  return (
    <div className="space-y-8">
      <ChecklistHeader 
        onCreateNew={() => {
          setIsEditing(false);
          setSelectedTemplate(null);
          setIsFormDialogOpen(true);
        }} 
      />
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Carregando...</p>
        </div>
      ) : (
        <ChecklistTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          checklists={checklists}
          results={results}
          scheduledAssessments={scheduledAssessments}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDelete}
          onCopyTemplate={handleCopyTemplate}
          onStartAssessment={handlePreviewTemplate}
          onViewResult={handleViewResult}
          onCreateTemplate={() => {
            setIsEditing(false);
            setSelectedTemplate(null);
            setIsFormDialogOpen(true);
          }}
          onSendEmail={handleSendEmail}
          onRefreshScheduled={refetchScheduled}
          isDeleting={isDeleting}
        />
      )}
      
      <ChecklistDialogs
        isFormDialogOpen={isFormDialogOpen}
        setIsFormDialogOpen={handleCloseFormDialog}
        isAssessmentDialogOpen={isAssessmentDialogOpen}
        setIsAssessmentDialogOpen={setIsAssessmentDialogOpen}
        isResultDialogOpen={isResultDialogOpen}
        setIsResultDialogOpen={setIsResultDialogOpen}
        selectedTemplate={selectedTemplate}
        selectedResult={selectedResult}
        onSubmitTemplate={handleSubmitTemplate}
        onSubmitAssessment={handleSubmitAssessment}
        onCloseAssessment={() => setIsAssessmentDialogOpen(false)}
        onCloseResult={() => {
          setIsResultDialogOpen(false);
          setSelectedResult(null);
        }}
        isEditing={isEditing}
      />

      <TemplatePreviewDialog
        isOpen={isPreviewDialogOpen}
        onClose={() => {
          setIsPreviewDialogOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
      />
    </div>
  );
}
