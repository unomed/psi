
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
  selectedTemplateValue?: string; // Added for controlled value
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onTemplateSelect: (templateId: string) => void;
}

export function TemplateSelector({
  selectedEmployee,
  selectedTemplateValue,
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
        value={selectedTemplateValue || "no-template-selected"}
        onValueChange={onTemplateSelect}
        disabled={!selectedEmployee || validTemplates.length === 0}
      >
        <SelectTrigger id="template">
          <SelectValue placeholder="Selecione um modelo de avaliação" />
        </SelectTrigger>
        <SelectContent>
          {validTemplates.length > 0 ? (
            validTemplates.map((template) => {
              const templateIdStr = String(template.id);
              if (templateIdStr.trim() === "") {
                console.error("[Assessments/TemplateSelector] Attempting to render SelectItem with empty value for template:", template);
                return null;
              }
              return (
                <SelectItem key={templateIdStr} value={templateIdStr}>
                  {template.title}
                </SelectItem>
              );
            }).filter(Boolean)
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

