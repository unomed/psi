
import { useState } from "react";
import { toast } from "sonner";
import { ChecklistTemplate } from "@/types/checklist";

export function useBasicAssessmentActions({
  setSelectedEmployee,
  setSelectedTemplate,
  setIsNewAssessmentDialogOpen,
  setActiveTab
}: {
  setSelectedEmployee: (employee: string | null) => void;
  setSelectedTemplate: (template: ChecklistTemplate | null) => void;
  setIsNewAssessmentDialogOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
}) {
  const handleNewAssessment = () => {
    setSelectedEmployee(null);
    setSelectedTemplate(null);
    setIsNewAssessmentDialogOpen(true);
  };

  const handleSendEmailToEmployee = () => {
    setIsNewAssessmentDialogOpen(false);
    setActiveTab("agendadas");
  };

  return {
    handleNewAssessment,
    handleSendEmailToEmployee
  };
}
