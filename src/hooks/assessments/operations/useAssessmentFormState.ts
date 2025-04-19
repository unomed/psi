
import { useState } from "react";
import { RecurrenceType } from "@/types";

export function useAssessmentFormState() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [dateError, setDateError] = useState<boolean>(false);
  const [showRecurrenceWarning, setShowRecurrenceWarning] = useState<boolean>(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");

  // Reset form state
  const resetForm = () => {
    setSelectedEmployee(null);
    setSelectedCompany(null);
    setSelectedSector(null);
    setSelectedRole(null);
    setDateError(false);
    setShowRecurrenceWarning(false);
    setRecurrenceType("none");
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
    dateError,
    setDateError,
    showRecurrenceWarning,
    setShowRecurrenceWarning,
    recurrenceType,
    setRecurrenceType,
    resetForm
  };
}
