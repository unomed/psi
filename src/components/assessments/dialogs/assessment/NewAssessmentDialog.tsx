
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAssessmentFormState } from "@/hooks/assessments/operations/useAssessmentFormState";
import { useAssessmentFormValidation } from "@/hooks/assessments/operations/useAssessmentFormValidation";
import { AssessmentForm } from "./AssessmentForm";
import { useState } from "react";
import { ChecklistTemplate } from "@/types";

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onSave: () => Promise<boolean> | boolean;
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
  
  const {
    selectedCompany,
    setSelectedCompany,
    selectedSector,
    setSelectedSector,
    selectedRole,
    setSelectedRole,
    dateError,
    setDateError,
    showRecurrenceWarning,
    setShowRecurrenceWarning,
    recurrenceType,
    setRecurrenceType,
    resetForm
  } = useAssessmentFormState();

  const { formErrors, validateForm } = useAssessmentFormValidation();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm({
      employeeId: selectedEmployee,
      templateId: selectedTemplate?.id || null,
      scheduledDate
    })) {
      return;
    }

    const saved = await onSave();
    if (saved) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação</DialogTitle>
          <DialogDescription>
            Selecione o funcionário e o modelo de avaliação para criar uma nova avaliação.
          </DialogDescription>
        </DialogHeader>

        <AssessmentForm
          selectedEmployee={selectedEmployee}
          selectedTemplate={selectedTemplate}
          selectedCompany={selectedCompany}
          selectedSector={selectedSector}
          selectedRole={selectedRole}
          dateError={dateError}
          showRecurrenceWarning={showRecurrenceWarning}
          templates={templates}
          isTemplatesLoading={isTemplatesLoading}
          scheduledDate={scheduledDate}
          onEmployeeSelect={onEmployeeSelect}
          onTemplateSelect={onTemplateSelect}
          onCompanyChange={setSelectedCompany}
          onSectorChange={setSelectedSector}
          onRoleChange={setSelectedRole}
          onDateSelect={(date) => {
            setScheduledDate(date);
            if (date) {
              setDateError(false);
              if (recurrenceType !== 'none') {
                setShowRecurrenceWarning(false);
              }
            } else {
              if (recurrenceType !== 'none') {
                setShowRecurrenceWarning(true);
              }
            }
          }}
          onRecurrenceChange={(type) => setRecurrenceType(type as any)}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}
