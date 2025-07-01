
import { useState } from "react";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { useDateHandling } from "./useDateHandling";
import { useAssessmentCreation } from "./useAssessmentCreation";

export function useAssessmentFormOperation(onClose: () => void) {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [showRecurrenceWarning, setShowRecurrenceWarning] = useState<boolean>(false);

  const { 
    scheduledDate, 
    dateError, 
    handleDateSelect, 
    validateDate 
  } = useDateHandling(new Date());

  const { handleSaveAssessment } = useAssessmentCreation();

  const handleSave = async () => {
    const saved = await handleSaveAssessment(
      selectedEmployee,
      selectedTemplate,
      scheduledDate
    );

    if (saved) {
      onClose();
    }
  };

  return {
    selectedEmployee,
    setSelectedEmployee,
    selectedCompany,
    setSelectedCompany,
    selectedSector,
    setSelectedSector,
    selectedRole,
    setSelectedRole,
    selectedTemplate,
    setSelectedTemplate,
    recurrenceType,
    setRecurrenceType,
    showRecurrenceWarning,
    setShowRecurrenceWarning,
    scheduledDate,
    dateError,
    handleDateSelect,
    handleSave
  };
}
