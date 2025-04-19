
import { useState } from "react";

export function useAssessmentFormValidation() {
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const validateForm = (data: {
    employeeId: string | null;
    templateId: string | null;
    scheduledDate: Date | undefined;
  }) => {
    const errors: Record<string, boolean> = {};

    if (!data.employeeId) {
      errors.employee = true;
    }

    if (!data.templateId) {
      errors.template = true;
    }

    if (!data.scheduledDate) {
      errors.date = true;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formErrors,
    validateForm
  };
}
