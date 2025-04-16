
import { useState } from "react";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTabs } from "@/components/checklists/ChecklistTabs";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";
import { ChecklistHeader } from "@/components/checklists/ChecklistHeader";
import { useChecklistData } from "@/hooks/useChecklistData";

export default function Checklists() {
  const [activeTab, setActiveTab] = useState("templates");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
          onStartAssessment={() => {}} // Empty function as we're not using this feature
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
        isAssessmentDialogOpen={false}
        setIsAssessmentDialogOpen={() => {}}
        isResultDialogOpen={isResultDialogOpen}
        setIsResultDialogOpen={setIsResultDialogOpen}
        selectedTemplate={selectedTemplate}
        selectedResult={selectedResult}
        onSubmitTemplate={isEditing ? handleUpdateTemplate : handleCreateTemplate}
        onSubmitAssessment={() => {}}
        onCloseAssessment={() => {}}
        onCloseResult={() => {
          setIsResultDialogOpen(false);
          setSelectedResult(null);
        }}
        isEditing={isEditing}
      />
    </div>
  );
}
