
import { TemplateSelectionCard } from "./TemplateSelectionCard";

interface TemplateSelectionGridProps {
  templates: any[];
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
  onUseTemplate: (templateId: string) => void;
}

export function TemplateSelectionGrid({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate, 
  onUseTemplate 
}: TemplateSelectionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
      {templates.map((template) => (
        <TemplateSelectionCard
          key={template.id}
          template={template}
          isSelected={selectedTemplate === template.id}
          onSelect={onSelectTemplate}
          onUseTemplate={onUseTemplate}
        />
      ))}
    </div>
  );
}
