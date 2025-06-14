
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
  selectedEmployee: string | null;
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
        disabled={!selectedEmployee}
      >
        <SelectTrigger id="template">
          <SelectValue placeholder="Selecione um modelo de avaliação" />
        </SelectTrigger>
        <SelectContent>
          {templates.length > 0 ? (
            templates.map((template) => {
              const templateId = template.id || `template-${template.title?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
              // Add validation to ensure we never pass empty strings
              if (!templateId || templateId.trim() === '') {
                console.error('Empty template ID detected:', template);
                return null;
              }
              return (
                <SelectItem key={templateId} value={templateId}>
                  {template.title || 'Modelo sem título'}
                </SelectItem>
              );
            }).filter(Boolean)
          ) : (
            <SelectItem value="no-templates-placeholder" disabled>
              Nenhum modelo encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
