
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
            templates.map((template) => (
              <SelectItem key={template.id} value={template.id || `template-${Math.random()}`}>
                {template.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem key="no-template" value="no-template">
              Nenhum modelo encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
