
import { ChecklistTemplate } from "@/types";
import { ChecklistTemplateCard } from "./ChecklistTemplateCard";

interface ChecklistTemplatesListProps {
  templates: ChecklistTemplate[];
  isLoading: boolean;
  onEditTemplate: (template: ChecklistTemplate) => void;
  onPreviewTemplate: (template: ChecklistTemplate) => void;
}

export function ChecklistTemplatesList({ 
  templates, 
  isLoading, 
  onEditTemplate, 
  onPreviewTemplate 
}: ChecklistTemplatesListProps) {
  if (isLoading) {
    return <div>Carregando templates...</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum template encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Templates de Checklist</h2>
      <div className="grid gap-4">
        {templates.map((template) => (
          <ChecklistTemplateCard
            key={template.id}
            template={template}
            onEdit={() => onEditTemplate(template)}
            onPreview={() => onPreviewTemplate(template)}
          />
        ))}
      </div>
    </div>
  );
}
