
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AssessmentSelectionTab } from "@/components/assessments/scheduling/AssessmentSelectionTab";
import { useEffect, useState } from "react";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { createSafeDate } from "@/utils/dateUtils";
import { AssessmentDateSection } from "./AssessmentDateSection";
import { AssessmentPeriodicitySection } from "./AssessmentPeriodicitySection";
import { AssessmentDialogHeader } from "./AssessmentDialogHeader";
import { AssessmentDialogFooter } from "./AssessmentDialogFooter";

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onSave: (date?: Date) => Promise<boolean> | boolean;
}

export function NewAssessmentDialog({
  isOpen,
  onClose,
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onEmployeeSelect,
  onTemplateSelect,
  onSave
}: NewAssessmentDialogProps) {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [dateError, setDateError] = useState<boolean>(false);
  const [showRecurrenceWarning, setShowRecurrenceWarning] = useState<boolean>(false);
  const [attemptedSave, setAttemptedSave] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const today = createSafeDate(new Date());
      console.log("Inicializando data com:", today, "Timestamp:", today.getTime());
      setScheduledDate(today);
      setDateError(false);
      setAttemptedSave(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (recurrenceType !== 'none' && !scheduledDate) {
      setShowRecurrenceWarning(true);
    } else {
      setShowRecurrenceWarning(false);
    }
  }, [recurrenceType, scheduledDate]);

  const handleSave = async () => {
    setAttemptedSave(true);
    
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de avaliação");
      return;
    }

    if (!scheduledDate) {
      setDateError(true);
      toast.error("Selecione uma data para a avaliação");
      return;
    }

    const safeDate = createSafeDate(scheduledDate);
    console.log("Salvando com data segura:", safeDate, "Timestamp:", safeDate.getTime());
    
    try {
      const saved = await onSave(safeDate);
      if (saved) {
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Ocorreu um erro ao salvar a avaliação");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <AssessmentDialogHeader />

        <div className="space-y-6">
          <AssessmentSelectionTab
            selectedEmployee={selectedEmployee}
            selectedTemplate={selectedTemplate}
            templates={templates}
            isTemplatesLoading={isTemplatesLoading}
            onEmployeeSelect={onEmployeeSelect}
            onTemplateSelect={onTemplateSelect}
            onNext={handleSave}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AssessmentDateSection
              scheduledDate={scheduledDate}
              onDateSelect={setScheduledDate}
              dateError={dateError}
            />

            <AssessmentPeriodicitySection
              recurrenceType={recurrenceType}
              onRecurrenceChange={setRecurrenceType}
              showRecurrenceWarning={showRecurrenceWarning}
              employeeId={selectedEmployee}
            />
          </div>

          <AssessmentDialogFooter
            onSave={handleSave}
            disabled={!selectedEmployee || !selectedTemplate || dateError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
