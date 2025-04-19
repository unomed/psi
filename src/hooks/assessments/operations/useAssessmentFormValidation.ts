
import { useState } from "react";
import { validateAssessmentDate } from "@/utils/dateUtils";

export function useAssessmentFormValidation() {
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const validateForm = (data: {
    employeeId: string | null;
    templateId: string | null;
    scheduledDate: Date | undefined;
  }) => {
    const errors: Record<string, boolean> = {};
    const messages: Record<string, string> = {};

    if (!data.employeeId) {
      errors.employee = true;
      messages.employee = "Selecione um funcionário.";
    }

    if (!data.templateId) {
      errors.template = true;
      messages.template = "Selecione um modelo de avaliação.";
    }

    // Use the new date validation utility
    const dateError = validateAssessmentDate(data.scheduledDate);
    if (dateError) {
      errors.date = true;
      messages.date = dateError;
    }

    setFormErrors(errors);
    setErrorMessages(messages);
    return Object.keys(errors).length === 0;
  };

  const clearError = (field: string) => {
    setFormErrors(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    
    setErrorMessages(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  return {
    formErrors,
    errorMessages,
    validateForm,
    clearError
  };
}
