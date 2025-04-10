
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTabs } from "@/components/checklists/ChecklistTabs";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";
import { fetchChecklistTemplates, fetchAssessmentResults, saveChecklistTemplate } from "@/services/checklistService";
import { useQuery } from "@tanstack/react-query";

export default function Checklists() {
  const [activeTab, setActiveTab] = useState("templates");
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
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

  const handleViewResult = (result: ChecklistResult) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  const handleCloseResult = () => {
    setIsResultDialogOpen(false);
    setSelectedResult(null);
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
          onStartAssessment={() => {}} // Empty function as we're not using this feature
          onViewResult={handleViewResult}
          onCreateTemplate={() => setIsFormDialogOpen(true)}
        />
      )}
      
      <ChecklistDialogs
        isFormDialogOpen={isFormDialogOpen}
        setIsFormDialogOpen={setIsFormDialogOpen}
        isAssessmentDialogOpen={false} // We're not using this dialog
        setIsAssessmentDialogOpen={() => {}} // Empty function as we're not using this feature
        isResultDialogOpen={isResultDialogOpen}
        setIsResultDialogOpen={setIsResultDialogOpen}
        selectedTemplate={selectedTemplate}
        selectedResult={selectedResult}
        onSubmitTemplate={handleCreateTemplate}
        onSubmitAssessment={() => {}} // Empty function as we're not using this feature
        onCloseAssessment={() => {}} // Empty function as we're not using this feature
        onCloseResult={handleCloseResult}
      />
    </div>
  );
}
