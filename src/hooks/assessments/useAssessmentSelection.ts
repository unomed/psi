
import { useState } from "react";
import { ChecklistTemplate } from "@/types/checklist";

export function useAssessmentSelection() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<string>("scheduled");

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
