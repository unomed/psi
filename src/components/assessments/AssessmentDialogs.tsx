
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";
import { ChecklistResult, ChecklistTemplate } from "@/types/checklist";

interface AssessmentDialogsProps {
  isAssessmentDialogOpen: boolean;
  onAssessmentDialogClose: () => void;
  isResultDialogOpen: boolean;
  onResultDialogClose: () => void;
  selectedTemplate: ChecklistTemplate | null;
  assessmentResult: ChecklistResult | null;
  onSubmitAssessment: (resultData: Omit<ChecklistResult, "id" | "completedAt">) => void;
  onCloseResult: () => void;
  employeeName: string;
}

export function AssessmentDialogs({
  isAssessmentDialogOpen,
  onAssessmentDialogClose,
  isResultDialogOpen,
  onResultDialogClose,
  selectedTemplate,
  assessmentResult,
  onSubmitAssessment,
  onCloseResult,
  employeeName
}: AssessmentDialogsProps) {
  return (
    <>
      {/* Assessment Dialog */}
      <Dialog open={isAssessmentDialogOpen} onOpenChange={onAssessmentDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <DiscAssessmentForm
              template={selectedTemplate}
              onSubmit={(resultData) => onSubmitAssessment({
                ...resultData,
                employeeName: employeeName
              })}
              onCancel={onAssessmentDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={onResultDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resultado da Avaliação</DialogTitle>
          </DialogHeader>
          {assessmentResult && (
            <DiscResultDisplay
              result={assessmentResult}
              onClose={onCloseResult}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
