
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChecklistTemplate } from "@/types";

interface TemplateSelectorProps {
  selectedEmployee?: string | null;
  templates: ChecklistTemplate[];
  selectedTemplateValue?: string | null;
  isTemplatesLoading?: boolean;
  onTemplateSelect: (templateId: string) => void;
}

export function TemplateSelector({
  selectedEmployee,
  templates,
  selectedTemplateValue,
  isTemplatesLoading,
  onTemplateSelect
}: TemplateSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="template">Modelo de Checklist</Label>
      <Select
        value={selectedTemplateValue || ""}
        onValueChange={onTemplateSelect}
        disabled={isTemplatesLoading || !selectedEmployee}
      >
        <SelectTrigger id="template">
          <SelectValue placeholder="Selecione um modelo" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.title || template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
