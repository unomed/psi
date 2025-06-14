
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChecklistTemplate } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateSelectorProps {
  selectedEmployee: string | null; // Keep selectedEmployee to enable/disable
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onTemplateSelect: (templateId: string) => void;
}

export function TemplateSelector({
  selectedEmployee,
  templates,
  isTemplatesLoading,
  onTemplateSelect,
}: TemplateSelectorProps) {
  const validTemplates = (templates || []).filter(template => 
    template && 
    template.id !== null &&
    template.id !== undefined &&
    String(template.id).trim() !== "" &&
    template.title && 
    String(template.title).trim() !== ""
  );

  if (isTemplatesLoading) {
    return (
      <div className="space-y-2">
        <Label>Modelo de Avaliação</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="template">Modelo de Avaliação</Label>
      <Select
        onValueChange={onTemplateSelect}
        disabled={!selectedEmployee || validTemplates.length === 0} // Also disable if no valid templates
      >
        <SelectTrigger id="template">
          <SelectValue placeholder="Selecione um modelo de avaliação" />
        </SelectTrigger>
        <SelectContent>
          {validTemplates.length > 0 ? (
            validTemplates.map((template) => (
              <SelectItem key={String(template.id)} value={String(template.id)}>
                {template.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-templates-available" disabled>
              Nenhum modelo encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
