
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ChecklistTemplate } from "@/types/checklist";

interface TemplateSelectorProps {
  selectedEmployee: string | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onTemplateSelect: (templateId: string) => void;
}

export function TemplateSelector({ 
  selectedEmployee, 
  templates, 
  isTemplatesLoading, 
  onTemplateSelect 
}: TemplateSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="template">Modelo de Checklist</Label>
      <Select 
        onValueChange={onTemplateSelect} 
        disabled={!selectedEmployee}
      >
        <SelectTrigger id="template">
          <SelectValue placeholder={selectedEmployee ? "Selecione um modelo" : "Primeiro selecione um funcionário"} />
        </SelectTrigger>
        <SelectContent>
          {isTemplatesLoading ? (
            <SelectItem value="loading" disabled>Carregando modelos...</SelectItem>
          ) : templates.length === 0 ? (
            <SelectItem value="empty" disabled>Nenhum modelo disponível</SelectItem>
          ) : (
            templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
