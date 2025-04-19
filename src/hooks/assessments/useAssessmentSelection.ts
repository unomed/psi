
import { useState } from "react";
import { ChecklistTemplate } from "@/types/checklist";

export function useAssessmentSelection() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  
  // Mantemos a variável activeTab para compatibilidade, mas não a usamos mais na interface
  const [activeTab, setActiveTab] = useState<string>("agendadas");

  return {
    selectedEmployee,
    setSelectedEmployee,
    selectedTemplate,
    setSelectedTemplate,
    scheduledDate,
    setScheduledDate,
    activeTab,
    setActiveTab
  };
}
