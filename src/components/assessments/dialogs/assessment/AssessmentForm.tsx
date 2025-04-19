
import { AssessmentSelectionTab } from "../../scheduling/AssessmentSelectionTab";
import { AssessmentDateSection } from "./AssessmentDateSection";
import { AssessmentPeriodicitySection } from "./AssessmentPeriodicitySection";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ChecklistTemplate } from "@/types";

interface AssessmentFormProps {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  selectedCompany: string | null;
  selectedSector: string | null;
  selectedRole: string | null;
  dateError: boolean;
  showRecurrenceWarning: boolean;
  employeeRiskLevel?: string;
  suggestedPeriodicity?: string;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  scheduledDate: Date | undefined;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onCompanyChange: (companyId: string) => void;
  onSectorChange: (sectorId: string) => void;
  onRoleChange: (roleId: string) => void;
  onDateSelect: (date: Date | undefined) => void;
  onRecurrenceChange: (type: string) => void;
  onSave: () => void;
}

export function AssessmentForm({
  selectedEmployee,
  selectedTemplate,
  selectedCompany,
  selectedSector,
  selectedRole,
  dateError,
  showRecurrenceWarning,
  employeeRiskLevel,
  suggestedPeriodicity,
  templates,
  isTemplatesLoading,
  scheduledDate,
  onEmployeeSelect,
  onTemplateSelect,
  onCompanyChange,
  onSectorChange,
  onRoleChange,
  onDateSelect,
  onRecurrenceChange,
  onSave
}: AssessmentFormProps) {
  return (
    <div className="space-y-6">
      <AssessmentSelectionTab
        selectedCompany={selectedCompany}
        selectedSector={selectedSector}
        selectedRole={selectedRole}
        selectedEmployee={selectedEmployee}
        selectedTemplate={selectedTemplate}
        onCompanyChange={onCompanyChange}
        onSectorChange={onSectorChange}
        onRoleChange={onRoleChange}
        onEmployeeChange={onEmployeeSelect}
        onTemplateSelect={onTemplateSelect}
        templates={templates}
        isTemplatesLoading={isTemplatesLoading}
        onNext={onSave}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AssessmentDateSection
          scheduledDate={scheduledDate}
          onDateSelect={onDateSelect}
          dateError={dateError}
        />

        <AssessmentPeriodicitySection
          recurrenceType={showRecurrenceWarning ? "none" : "semiannual"}
          onRecurrenceChange={onRecurrenceChange}
          showRecurrenceWarning={showRecurrenceWarning}
          employeeRiskLevel={employeeRiskLevel}
          suggestedPeriodicity={suggestedPeriodicity}
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={!selectedEmployee || !selectedTemplate || dateError}
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Avaliação
        </Button>
      </div>
    </div>
  );
}
