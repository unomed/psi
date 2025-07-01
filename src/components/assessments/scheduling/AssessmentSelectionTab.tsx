
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
    // Validate employeeId before proceeding
    const validEmployeeId = employeeId && employeeId.trim() !== "" ? employeeId : "";
    
    if (onEmployeeChange) {
      onEmployeeChange(validEmployeeId);
    } else if (onEmployeeSelect) {
      onEmployeeSelect(validEmployeeId);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    // Validate companyId before proceeding
    const validCompanyId = companyId && companyId.trim() !== "" ? companyId : "";
    if (onCompanyChange) {
      onCompanyChange(validCompanyId);
    }
  };

  const handleSectorChange = (sectorId: string) => {
    // Validate sectorId before proceeding
    const validSectorId = sectorId && sectorId.trim() !== "" ? sectorId : "";
    if (onSectorChange) {
      onSectorChange(validSectorId);
    }
  };

  const handleRoleChange = (roleId: string) => {
    // Validate roleId before proceeding
    const validRoleId = roleId && roleId.trim() !== "" ? roleId : "";
    if (onRoleChange) {
      onRoleChange(validRoleId);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    // Validate templateId before proceeding
    const validTemplateId = templateId && templateId.trim() !== "" ? templateId : "";
    if (validTemplateId) {
      onTemplateSelect(validTemplateId);
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
        onTemplateSelect={handleTemplateSelect}
        selectedCompany={selectedCompany}
        selectedSector={selectedSector}
        selectedRole={selectedRole}
        onCompanyChange={handleCompanyChange}
        onSectorChange={handleSectorChange}
        onRoleChange={handleRoleChange}
        onNext={onNext}
      />
    </div>
  );
}
