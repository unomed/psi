
import { useState } from "react";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTabs } from "@/components/checklists/ChecklistTabs";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";
import { ChecklistHeader } from "@/components/checklists/ChecklistHeader";
import { useChecklistData } from "@/hooks/useChecklistData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Checklists() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all"); // Mudamos o padrão para "all" para mostrar todos os checklists
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);

  const {
    checklists,
    results,
    isLoading,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCopyTemplate
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

  const handleStartAssessment = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setIsAssessmentDialogOpen(true);
    // Você pode escolher abrir um diálogo para selecionar um funcionário
    // ou navegar diretamente para a página de avaliação
    toast.success(`Iniciando avaliação para ${template.title}`);
  };

  const handleSubmitAssessment = async (resultData: any) => {
    // Aqui você pode implementar a lógica para salvar os resultados da avaliação
    console.log("Salvando resultados da avaliação:", resultData);
    toast.success("Avaliação concluída com sucesso!");
    setIsAssessmentDialogOpen(false);
  };

  const handleSubmitTemplate = async (templateData: Omit<ChecklistTemplate, "id" | "createdAt"> | ChecklistTemplate) => {
    let success = false;
    
    if (isEditing && selectedTemplate) {
      // Make sure we're passing the full template with ID to update function
      const updatedTemplate = {
        ...selectedTemplate,
        ...(templateData as Omit<ChecklistTemplate, "id" | "createdAt">)
      };
      success = await handleUpdateTemplate(updatedTemplate);
    } else {
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
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onCopyTemplate={handleCopyTemplate}
          onStartAssessment={handleStartAssessment}
          onViewResult={handleViewResult}
          onCreateTemplate={() => {
            setIsEditing(false);
            setSelectedTemplate(null);
            setIsFormDialogOpen(true);
          }}
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
    </div>
  );
}
