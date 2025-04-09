
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChecklistResult, ChecklistTemplate } from "@/types/checklist";
import { ChecklistTemplateForm } from "@/components/checklists/ChecklistTemplateForm";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";

interface ChecklistDialogsProps {
  isFormDialogOpen: boolean;
  setIsFormDialogOpen: (open: boolean) => void;
  isAssessmentDialogOpen: boolean;
  setIsAssessmentDialogOpen: (open: boolean) => void;
  isResultDialogOpen: boolean;
  setIsResultDialogOpen: (open: boolean) => void;
  selectedTemplate: ChecklistTemplate | null;
  selectedResult: ChecklistResult | null;
  onSubmitTemplate: (data: Omit<ChecklistTemplate, "id" | "createdAt">) => void;
  onSubmitAssessment: (data: Omit<ChecklistResult, "id" | "completedAt">) => void;
  onCloseAssessment: () => void;
  onCloseResult: () => void;
}

export function ChecklistDialogs({
  isFormDialogOpen,
  setIsFormDialogOpen,
  isAssessmentDialogOpen,
  setIsAssessmentDialogOpen,
  isResultDialogOpen,
  setIsResultDialogOpen,
  selectedTemplate,
  selectedResult,
  onSubmitTemplate,
  onSubmitAssessment,
  onCloseAssessment,
  onCloseResult,
}: ChecklistDialogsProps) {
  return (
    <>
      {/* Dialog for creating a new checklist template */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Modelo de Checklist</DialogTitle>
          </DialogHeader>
          <ChecklistTemplateForm onSubmit={onSubmitTemplate} />
        </DialogContent>
      </Dialog>
      
      {/* Dialog for taking an assessment */}
      <Dialog 
        open={isAssessmentDialogOpen && selectedTemplate !== null} 
        onOpenChange={setIsAssessmentDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <DiscAssessmentForm 
              template={selectedTemplate}
              onSubmit={onSubmitAssessment}
              onCancel={onCloseAssessment}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog for displaying results */}
      <Dialog 
        open={isResultDialogOpen && selectedResult !== null} 
        onOpenChange={setIsResultDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resultado da Avaliação</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <DiscResultDisplay 
              result={selectedResult}
              onClose={onCloseResult}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
