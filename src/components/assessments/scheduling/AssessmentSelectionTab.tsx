
import { Label } from "@/components/ui/label";
import { CompanySelector } from "../selectors/CompanySelector";
import { SectorSelector } from "../selectors/SectorSelector";
import { RoleSelector } from "../selectors/RoleSelector";
import { EmployeeSelector } from "../selectors/EmployeeSelector";
import { TemplateSelector } from "../selectors/TemplateSelector";
import { ChecklistTemplate } from "@/types";

interface AssessmentSelectionTabProps {
  selectedCompany: string | null;
  selectedSector: string | null;
  selectedRole: string | null;
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  onCompanyChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onEmployeeChange: (value: string) => void;
  onTemplateSelect: (value: string) => void;
  onNext: () => void;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
}

export function AssessmentSelectionTab({
  selectedCompany,
  selectedSector,
  selectedRole,
  selectedEmployee,
  selectedTemplate,
  onCompanyChange,
  onSectorChange,
  onRoleChange,
  onEmployeeChange,
  onTemplateSelect,
  templates,
  isTemplatesLoading
}: AssessmentSelectionTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanySelector 
          selectedCompany={selectedCompany} 
          onCompanyChange={onCompanyChange} 
        />
        
        <SectorSelector 
          selectedCompany={selectedCompany}
          selectedSector={selectedSector}
          onSectorChange={onSectorChange}
        />
        
        <RoleSelector 
          selectedSector={selectedSector}
          selectedRole={selectedRole}
          onRoleChange={onRoleChange}
        />
        
        <EmployeeSelector 
          selectedRole={selectedRole}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={onEmployeeChange}
        />
      </div>
      
      <div className="w-full">
        <TemplateSelector 
          selectedEmployee={selectedEmployee}
          templates={templates}
          isTemplatesLoading={isTemplatesLoading}
          onTemplateSelect={onTemplateSelect}
        />
      </div>
    </div>
  );
}
