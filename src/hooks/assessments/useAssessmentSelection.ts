
import { useState } from "react";
import { ChecklistTemplate } from "@/types";

export function useAssessmentSelectionState() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    setSelectedSector(null);
    setSelectedRole(null);
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    setSelectedRole(null);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  return {
    selectedCompany,
    selectedSector,
    selectedRole,
    handleCompanyChange,
    handleSectorChange,
    handleRoleChange,
  };
}
