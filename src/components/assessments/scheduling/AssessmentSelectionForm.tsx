
import React from "react";
import { ChecklistTemplate } from "@/types/checklist";
import { CompanySelector } from "../selectors/CompanySelector";
import { SectorSelector } from "../selectors/SectorSelector";
import { RoleSelector } from "../selectors/RoleSelector";
import { EmployeeSelector } from "../selectors/EmployeeSelector";
import { TemplateSelector } from "../selectors/TemplateSelector";
import { useAssessmentSelection } from "@/hooks/assessments/useAssessmentSelection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AssessmentSelectionFormProps {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  selectedCompany?: string | null;
  selectedSector?: string | null;
  selectedRole?: string | null;
  onCompanyChange?: (companyId: string) => void;
  onSectorChange?: (sectorId: string) => void;
  onRoleChange?: (roleId: string) => void;
  onNext?: () => void;
}

export function AssessmentSelectionForm({
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onEmployeeSelect,
  onTemplateSelect,
  selectedCompany: externalSelectedCompany,
  selectedSector: externalSelectedSector,
  selectedRole: externalSelectedRole,
  onCompanyChange: externalOnCompanyChange,
  onSectorChange: externalOnSectorChange,
  onRoleChange: externalOnRoleChange,
  onNext
}: AssessmentSelectionFormProps) {
  // Use internal state if no external state is provided
  const internalState = useAssessmentSelectionState();
  
  const selectedCompany = externalSelectedCompany !== undefined ? externalSelectedCompany : internalState.selectedCompany;
  const selectedSector = externalSelectedSector !== undefined ? externalSelectedSector : internalState.selectedSector;
  const selectedRole = externalSelectedRole !== undefined ? externalSelectedRole : internalState.selectedRole;
  
  const handleCompanyChange = (value: string) => {
    if (externalOnCompanyChange) {
      externalOnCompanyChange(value);
    } else {
      internalState.handleCompanyChange(value);
    }
  };

  const handleSectorChange = (value: string) => {
    if (externalOnSectorChange) {
      externalOnSectorChange(value);
    } else {
      internalState.handleSectorChange(value);
    }
  };

  const handleRoleChange = (value: string) => {
    if (externalOnRoleChange) {
      externalOnRoleChange(value);
    } else {
      internalState.handleRoleChange(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanySelector
          selectedCompany={selectedCompany}
          onCompanyChange={handleCompanyChange}
        />

        <SectorSelector
          selectedCompany={selectedCompany}
          selectedSector={selectedSector}
          onSectorChange={handleSectorChange}
        />

        <RoleSelector
          selectedSector={selectedSector}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />

        <EmployeeSelector
          selectedRole={selectedRole}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={onEmployeeSelect}
        />
      </div>

      <TemplateSelector
        selectedEmployee={selectedEmployee}
        templates={templates}
        isTemplatesLoading={isTemplatesLoading}
        onTemplateSelect={onTemplateSelect}
      />

      {onNext && (
        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!selectedEmployee || !selectedTemplate}
          >
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function for component internal state
function useAssessmentSelectionState() {
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(null);
  const [selectedSector, setSelectedSector] = React.useState<string | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  
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
