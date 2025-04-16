import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock, Link2, Mail, Save } from "lucide-react";
import { ChecklistTemplate } from "@/types/checklist";
import { CompanySelector } from "./selectors/CompanySelector";
import { SectorSelector } from "./selectors/SectorSelector";
import { RoleSelector } from "./selectors/RoleSelector";
import { EmployeeSelector } from "./selectors/EmployeeSelector";
import { TemplateSelector } from "./selectors/TemplateSelector";

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onScheduleAssessment: () => void;
  onGenerateLink: () => void;
  onSendEmail: () => void;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onSave: () => void;
}

export function NewAssessmentDialog({
  isOpen,
  onClose,
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onScheduleAssessment,
  onGenerateLink,
  onSendEmail,
  onEmployeeSelect,
  onTemplateSelect,
  onSave
}: NewAssessmentDialogProps) {
  const [isSaved, setIsSaved] = useState(false);
  
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleCompanyChange = (value: string) => {
    setIsSaved(false);
    setSelectedCompany(value);
    setSelectedSector(null);
    setSelectedRole(null);
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleSectorChange = (value: string) => {
    setIsSaved(false);
    setSelectedSector(value);
    setSelectedRole(null);
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleRoleChange = (value: string) => {
    setIsSaved(false);
    setSelectedRole(value);
    onEmployeeSelect(""); // Clear employee selection
  };

  const handleSave = () => {
    onSave();
    setIsSaved(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Avaliação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
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
          
          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSave}
              disabled={!selectedEmployee || !selectedTemplate}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            
            <Button
              variant="outline"
              disabled={!isSaved}
              onClick={onGenerateLink}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Gerar Link
            </Button>
            
            <Button
              variant="outline"
              disabled={!isSaved}
              onClick={onScheduleAssessment}
            >
              <CalendarClock className="mr-2 h-4 w-4" />
              Agendar
            </Button>
            
            <Button
              type="submit"
              disabled={!isSaved}
              onClick={onSendEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              Enviar por Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
