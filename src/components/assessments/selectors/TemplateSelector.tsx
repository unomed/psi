
import React from "react";
import { Label } from "@/components/ui/label";
import { ChecklistTemplate } from "@/types"; // Using existing import
import { Skeleton } from "@/components/ui/skeleton";
import { SafeSelect } from "@/components/ui/SafeSelect";

interface TemplateSelectorProps {
  selectedEmployee: string | null;
  selectedTemplateValue?: string; 
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
  // SafeSelect handles filtering internally
  // We can pass `templates` directly.

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
      <SafeSelect<ChecklistTemplate>
        data={templates}
        value={selectedTemplateValue}
        onChange={onTemplateSelect}
        placeholder="Selecione um modelo de avaliação"
        valueField="id"
        labelField="title" // ChecklistTemplate uses 'title'
        disabled={!selectedEmployee || (templates || []).length === 0}
        className="w-full"
      />
    </div>
  );
}
