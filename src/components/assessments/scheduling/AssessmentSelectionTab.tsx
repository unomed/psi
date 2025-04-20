
import React from "react";
import { ChecklistTemplate } from "@/types/checklist";
import { AssessmentSelectionForm } from "./AssessmentSelectionForm";

interface AssessmentSelectionTabProps {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect?: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  selectedCompany?: string | null;
  selectedSector?: string | null;
  selectedRole?: string | null;
  onCompanyChange?: (companyId: string) => void;
  onSectorChange?: (sectorId: string) => void;
  onRoleChange?: (roleId: string) => void;
  onNext?: () => void;
  onEmployeeChange?: (employeeId: string) => void;
}

export function AssessmentSelectionTab({
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onEmployeeSelect,
  onTemplateSelect,
  selectedCompany,
  selectedSector,
  selectedRole,
  onCompanyChange,
  onSectorChange,
  onRoleChange,
  onNext,
  onEmployeeChange
}: AssessmentSelectionTabProps) {
  // Use either onEmployeeSelect or onEmployeeChange based on what's provided
  const handleEmployeeChange = (employeeId: string) => {
    if (onEmployeeChange) {
      onEmployeeChange(employeeId);
    } else if (onEmployeeSelect) {
      onEmployeeSelect(employeeId);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Nova Avaliação</h2>
      
      <AssessmentSelectionForm
        selectedEmployee={selectedEmployee}
        selectedTemplate={selectedTemplate}
        templates={templates}
        isTemplatesLoading={isTemplatesLoading}
        onEmployeeSelect={handleEmployeeChange}
        onTemplateSelect={onTemplateSelect}
        selectedCompany={selectedCompany}
        selectedSector={selectedSector}
        selectedRole={selectedRole}
        onCompanyChange={onCompanyChange}
        onSectorChange={onSectorChange}
        onRoleChange={onRoleChange}
        onNext={onNext}
      />
    </div>
  );
}
