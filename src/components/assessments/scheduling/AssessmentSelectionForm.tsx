
import React from "react";
import { ChecklistTemplate } from "@/types";
import { CompanySelector } from "../selectors/CompanySelector";
import { SectorSelector } from "../selectors/SectorSelector";
import { RoleSelector } from "../selectors/RoleSelector";
import { EmployeeSelector } from "../selectors/EmployeeSelector";
import { TemplateSelector } from "../selectors/TemplateSelector";
import { useAssessmentSelectionState } from "@/hooks/assessments/useAssessmentSelection";

interface AssessmentSelectionFormProps {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
}

export function AssessmentSelectionForm({
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onEmployeeSelect,
  onTemplateSelect,
}: AssessmentSelectionFormProps) {
  const {
    selectedCompany,
    selectedSector,
    selectedRole,
    handleCompanyChange,
    handleSectorChange,
    handleRoleChange,
  } = useAssessmentSelectionState();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanySelector
          selectedCompany={selectedCompany}
          onCompanyChange={handleCompanyChange}
        />

        <SectorSelector
          selectedCompany={selectedCompany}
          selectedSector={selectedSector}
          onSectorChange={handleSectorChange}
        />

        <RoleSelector
          selectedSector={selectedSector}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />

        <EmployeeSelector
          selectedRole={selectedRole}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={onEmployeeSelect}
        />
      </div>

      <TemplateSelector
        selectedEmployee={selectedEmployee}
        templates={templates}
        isTemplatesLoading={isTemplatesLoading}
        onTemplateSelect={onTemplateSelect}
      />
    </div>
  );
}
