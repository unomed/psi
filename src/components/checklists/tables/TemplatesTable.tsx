
import { ChecklistTemplate } from "@/types";
import { BaseTemplateTable } from "./BaseTemplateTable";

interface TemplatesTableProps {
  templates: ChecklistTemplate[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  isDeleting?: boolean;
}

export function TemplatesTable({
  templates,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
  isDeleting = false,
}: TemplatesTableProps) {
  const discTemplates = templates.filter(template => template.type === "disc");

  return (
    <BaseTemplateTable
      templates={discTemplates}
      caption="Lista de modelos de checklist disponíveis"
      onEdit={onEditTemplate}
      onDelete={onDeleteTemplate}
      onCopy={onCopyTemplate}
      onStart={onStartAssessment}
      showCategories={false}
      isDeleting={isDeleting}
    />
  );
}
