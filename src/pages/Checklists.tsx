
import { useState } from "react";
import { ChecklistHeader } from "@/components/checklists/ChecklistHeader";
import { ChecklistTemplatesList } from "@/components/checklists/ChecklistTemplatesList";
import { ChecklistResultsList } from "@/components/checklists/ChecklistResultsList";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";
import { ChecklistTemplate, ChecklistResult } from "@/types";
import { useChecklistTemplates, useChecklistOperations } from "@/hooks/checklist/useChecklistTemplates";
import { fetchAssessmentResults } from "@/services/checklist/resultService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Checklists() {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { checklists, isLoading } = useChecklistTemplates();
  const { createTemplate, updateTemplate } = useChecklistOperations();
  
  const { data: results = [], refetch: refetchResults } = useQuery({
    queryKey: ['assessment-results'],
    queryFn: fetchAssessmentResults
  });

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setIsFormDialogOpen(true);
  };

  const handleEditTemplate = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setIsFormDialogOpen(true);
  };

  const handleStartAssessment = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setIsAssessmentDialogOpen(true);
  };

  const handleViewResult = (result: ChecklistResult) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  // Corrigido: Adicionando o segundo parâmetro isStandard
  const handleSubmitTemplate = async (data: Omit<ChecklistTemplate, "id" | "createdAt"> | ChecklistTemplate, isStandard = false) => {
    try {
      if (isEditing && 'id' in data) {
        await updateTemplate(data.id, data);
        toast.success("Template atualizado com sucesso!");
      } else {
        await createTemplate(data as Omit<ChecklistTemplate, "id" | "createdAt">);
        toast.success("Template criado com sucesso!");
      }
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      toast.error("Erro ao salvar template");
    }
  };

  const handleSubmitAssessment = async (data: any) => {
    try {
      console.log("Submitting assessment:", data);
      toast.success("Avaliação realizada com sucesso!");
      setIsAssessmentDialogOpen(false);
      refetchResults();
    } catch (error) {
      console.error("Erro ao realizar avaliação:", error);
      toast.error("Erro ao realizar avaliação");
    }
  };

  const handleCloseAssessment = () => {
    setIsAssessmentDialogOpen(false);
    setSelectedTemplate(null);
  };

  const handleCloseResult = () => {
    setIsResultDialogOpen(false);
    setSelectedResult(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <ChecklistHeader onCreateTemplate={handleCreateTemplate} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChecklistTemplatesList
          templates={checklists}
          isLoading={isLoading}
          onEditTemplate={handleEditTemplate}
          onStartAssessment={handleStartAssessment}
        />
        
        <ChecklistResultsList
          results={results}
          onViewResult={handleViewResult}
        />
      </div>

      <ChecklistDialogs
        isFormDialogOpen={isFormDialogOpen}
        setIsFormDialogOpen={setIsFormDialogOpen}
        isAssessmentDialogOpen={isAssessmentDialogOpen}
        setIsAssessmentDialogOpen={setIsAssessmentDialogOpen}
        isResultDialogOpen={isResultDialogOpen}
        setIsResultDialogOpen={setIsResultDialogOpen}
        selectedTemplate={selectedTemplate}
        selectedResult={selectedResult}
        onSubmitTemplate={handleSubmitTemplate}
        onSubmitAssessment={handleSubmitAssessment}
        onCloseAssessment={handleCloseAssessment}
        onCloseResult={handleCloseResult}
        isEditing={isEditing}
      />
    </div>
  );
}
