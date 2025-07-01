
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AssessmentSelectionTab } from "@/components/assessments/scheduling/AssessmentSelectionTab";
import { ChecklistTemplate } from "@/types";
import { AssessmentDateSection } from "./AssessmentDateSection";
import { AssessmentPeriodicitySection } from "./AssessmentPeriodicitySection";
import { AssessmentDialogHeader } from "./AssessmentDialogHeader";
import { AssessmentDialogFooter } from "./AssessmentDialogFooter";
import { useAssessmentFormOperation } from "@/hooks/assessments/operations/useAssessmentFormOperation";

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
    selectedCompany,
    setSelectedCompany,
    selectedSector,
    setSelectedSector,
    selectedRole,
    setSelectedRole,
    recurrenceType,
    setRecurrenceType,
    showRecurrenceWarning,
    setShowRecurrenceWarning,
    scheduledDate,
    dateError,
    handleDateSelect,
    handleSave
  } = useAssessmentFormOperation(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <AssessmentDialogHeader />

        <div className="space-y-6">
          <AssessmentSelectionTab
            selectedCompany={selectedCompany}
            selectedSector={selectedSector}
            selectedRole={selectedRole}
            selectedEmployee={selectedEmployee}
            selectedTemplate={selectedTemplate}
            onCompanyChange={setSelectedCompany}
            onSectorChange={setSelectedSector}
            onRoleChange={setSelectedRole}
            onEmployeeChange={onEmployeeSelect}
            onTemplateSelect={onTemplateSelect}
            templates={templates}
            isTemplatesLoading={isTemplatesLoading}
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
