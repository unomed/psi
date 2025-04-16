
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTemplateForm } from "@/components/checklists/ChecklistTemplateForm";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";

interface ChecklistDialogsProps {
  isFormDialogOpen: boolean;
  setIsFormDialogOpen: (open: boolean) => void;
  isAssessmentDialogOpen: boolean;
  setIsAssessmentDialogOpen: (open: boolean) => void;
  isResultDialogOpen: boolean;
  setIsResultDialogOpen: (open: boolean) => void;
  selectedTemplate: ChecklistTemplate | null;
  selectedResult: ChecklistResult | null;
  onSubmitTemplate: (data: Omit<ChecklistTemplate, "id" | "createdAt"> | ChecklistTemplate) => void;
  onSubmitAssessment: (data: any) => void;
  onCloseAssessment: () => void;
  onCloseResult: () => void;
  isEditing?: boolean;
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
  isEditing = false
}: ChecklistDialogsProps) {
  return (
    <>
      {/* Template Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Modelo de Checklist" : "Novo Modelo de Checklist"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ChecklistTemplateForm 
              onSubmit={onSubmitTemplate} 
              existingTemplate={selectedTemplate}
              isEditing={isEditing}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Assessment Dialog */}
      <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Avaliação: {selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedTemplate && (
              <DiscAssessmentForm
                template={selectedTemplate}
                onSubmit={onSubmitAssessment}
                onCancel={onCloseAssessment}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resultado da Avaliação</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedResult && <DiscResultDisplay result={selectedResult} onClose={onCloseResult} />}
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              onClick={onCloseResult}
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
