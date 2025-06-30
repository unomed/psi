
import { useState } from "react";
import { RecurrenceType } from "@/types";

export function useAssessmentFormOperation(onClose: () => void) {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [showRecurrenceWarning, setShowRecurrenceWarning] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [dateError, setDateError] = useState<string>("");

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setScheduledDate(date);
      setDateError("");
    } else {
      setDateError("Data é obrigatória");
    }
  };

  const handleSave = async () => {
    try {
      // Implementation for saving
      console.log("Saving assessment...");
      onClose();
      return true;
    } catch (error) {
      console.error("Error saving assessment:", error);
      return false;
    }
  };

  return {
    selectedCompany,
    setSelectedCompany,
    selectedSector,
    setSelectedSector,
    selectedRole,
    setSelectedRole,
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
