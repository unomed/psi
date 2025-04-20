
import React from "react";
import { ChecklistTemplate } from "@/types";
import { AssessmentSelectionForm } from "./AssessmentSelectionForm";

interface AssessmentSelectionTabProps {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
}

export function AssessmentSelectionTab({
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onEmployeeSelect,
  onTemplateSelect,
}: AssessmentSelectionTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Nova Avaliação</h2>
      
      <AssessmentSelectionForm
        selectedEmployee={selectedEmployee}
        selectedTemplate={selectedTemplate}
        templates={templates}
        isTemplatesLoading={isTemplatesLoading}
        onEmployeeSelect={onEmployeeSelect}
        onTemplateSelect={onTemplateSelect}
      />
    </div>
  );
}
