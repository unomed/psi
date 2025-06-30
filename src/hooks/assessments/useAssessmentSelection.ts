import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChecklistTemplate } from "@/types";
import { toast } from "sonner";

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

// Also export with the "state" name for compatibility
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
    setSelectedCompany,
    selectedSector,
    setSelectedSector,
    selectedRole,
    setSelectedRole,
    handleCompanyChange,
    handleSectorChange,
    handleRoleChange
  };
}
