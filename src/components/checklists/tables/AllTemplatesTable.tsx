
import { ChecklistTemplate } from "@/types/checklist";
import { BaseTemplateTable } from "./BaseTemplateTable";

interface AllTemplatesTableProps {
  templates: ChecklistTemplate[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  isDeleting?: boolean;
}

export function AllTemplatesTable({
  templates,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
  isDeleting = false,
}: AllTemplatesTableProps) {
  return (
    <BaseTemplateTable
      templates={templates}
      caption="Todos os modelos cadastrados (incluindo Psicossocial e Personalizado)"
      onEditTemplate={onEditTemplate}
      onDeleteTemplate={onDeleteTemplate}
      onCopyTemplate={onCopyTemplate}
      onPreviewTemplate={onStartAssessment}
      showCategories={true}
      isDeleting={isDeleting}
    />
  );
}
