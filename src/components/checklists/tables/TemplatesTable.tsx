
import { ChecklistTemplate } from "@/types/checklist";
import { BaseTemplateTable } from "./BaseTemplateTable";

interface TemplatesTableProps {
  templates: ChecklistTemplate[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
}

export function TemplatesTable({
  templates,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
}: TemplatesTableProps) {
  const discTemplates = templates.filter(template => template.type === "disc");

  return (
    <BaseTemplateTable
      templates={discTemplates}
      caption="Lista de modelos de checklist disponíveis"
      onEditTemplate={onEditTemplate}
      onDeleteTemplate={onDeleteTemplate}
      onCopyTemplate={onCopyTemplate}
      onStartAssessment={onStartAssessment}
      showCategories={false}
    />
  );
}
