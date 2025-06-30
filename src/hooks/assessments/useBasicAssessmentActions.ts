import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate } from "@/types";
import { toast } from "sonner";

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
