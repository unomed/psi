
import { useState } from "react";
import { toast } from "sonner";
import { ChecklistTemplate } from "@/types/checklist";
import { CompanySelector } from "./selectors/CompanySelector";
import { SectorSelector } from "./selectors/SectorSelector";
import { RoleSelector } from "./selectors/RoleSelector";
import { EmployeeSelector } from "./selectors/EmployeeSelector";
import { TemplateSelector } from "./selectors/TemplateSelector";
import { AssessmentActionButtons } from "./AssessmentActionButtons";
import { mockEmployees } from "./mock/assessmentMockData";

interface AssessmentSelectionFormProps {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onStartAssessment: () => void;
  onScheduleAssessment: () => void;
  onGenerateLink: () => void;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
}

export function AssessmentSelectionForm({
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onStartAssessment,
  onScheduleAssessment,
  onGenerateLink,
  onEmployeeSelect,
  onTemplateSelect
}: AssessmentSelectionFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Handle selection changes
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    setSelectedSector(null);
    setSelectedRole(null);
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    setSelectedRole(null);
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    onEmployeeSelect(""); // Clear employee selection
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Nova Avaliação</h2>
      
      <div className="space-y-4">
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
        
        <AssessmentActionButtons 
          disabled={!selectedEmployee || !selectedTemplate}
          onStartAssessment={onStartAssessment}
          onScheduleAssessment={onScheduleAssessment}
          onGenerateLink={onGenerateLink}
        />
      </div>
    </div>
  );
}

// Export mock data for use in other components
export { mockEmployees };
