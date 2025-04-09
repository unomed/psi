
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTabs } from "@/components/checklists/ChecklistTabs";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";
import { fetchChecklistTemplates, fetchAssessmentResults, saveChecklistTemplate, saveAssessmentResult } from "@/services/checklistService";
import { useQuery } from "@tanstack/react-query";

export default function Checklists() {
  const [activeTab, setActiveTab] = useState("templates");
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);

  // Use TanStack Query to fetch checklists and results
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
      await saveChecklistTemplate(data);
      setIsFormDialogOpen(false);
      toast.success("Modelo de checklist criado com sucesso!");
      refetchChecklists();
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Erro ao criar modelo de checklist.");
    }
  };

  const handleEditTemplate = (template: ChecklistTemplate) => {
    // For demonstration, we'll just show a toast
    toast.info("Edição de checklist será implementada em breve!");
  };

  const handleStartAssessment = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setIsAssessmentDialogOpen(true);
  };

  const handleSubmitAssessment = async (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    try {
      await saveAssessmentResult(resultData);
      setIsAssessmentDialogOpen(false);
      
      // Find the result in the updated results list
      refetchResults().then(() => {
        // After refetching, show the results dialog with the latest assessment
        // This is a simplification - in a real app you'd want to get the specific result
        const newResult = {
          ...resultData,
          id: `temp-${Date.now()}`, // Temporary ID until we refresh
          completedAt: new Date()
        };
        setSelectedResult(newResult);
        setIsResultDialogOpen(true);
      });
      
      toast.success("Avaliação concluída com sucesso!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Erro ao submeter avaliação.");
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
          onStartAssessment={handleStartAssessment}
          onViewResult={handleViewResult}
          onCreateTemplate={() => setIsFormDialogOpen(true)}
        />
      )}
      
      <ChecklistDialogs
        isFormDialogOpen={isFormDialogOpen}
        setIsFormDialogOpen={setIsFormDialogOpen}
        isAssessmentDialogOpen={isAssessmentDialogOpen}
        setIsAssessmentDialogOpen={setIsAssessmentDialogOpen}
        isResultDialogOpen={isResultDialogOpen}
        setIsResultDialogOpen={setIsResultDialogOpen}
        selectedTemplate={selectedTemplate}
        selectedResult={selectedResult}
        onSubmitTemplate={handleCreateTemplate}
        onSubmitAssessment={handleSubmitAssessment}
        onCloseAssessment={handleCloseAssessment}
        onCloseResult={handleCloseResult}
      />
    </div>
  );
}
