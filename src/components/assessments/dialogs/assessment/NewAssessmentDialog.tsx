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
import { useDateHandling } from "@/hooks/assessments/operations/useDateHandling";

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
  const { 
    scheduledDate, 
    dateError, 
    handleDateSelect, 
    validateDate 
  } = useDateHandling(new Date());
  
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [showRecurrenceWarning, setShowRecurrenceWarning] = useState<boolean>(false);

  useEffect(() => {
    if (recurrenceType !== 'none' && !scheduledDate) {
      setShowRecurrenceWarning(true);
    } else {
      setShowRecurrenceWarning(false);
    }
  }, [recurrenceType, scheduledDate]);

  const handleSave = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de avaliação");
      return;
    }

    if (!validateDate()) {
      return;
    }

    try {
      const saved = await onSave(scheduledDate);
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
            onEmployeeChange={onEmployeeSelect}
            onTemplateSelect={onTemplateSelect}
            onNext={handleSave}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AssessmentDateSection
              scheduledDate={scheduledDate}
              onDateSelect={handleDateSelect}
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
