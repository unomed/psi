
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock, Link2, Mail, Save } from "lucide-react";
import { ChecklistTemplate } from "@/types";
import { CompanySelector } from "./selectors/CompanySelector";
import { SectorSelector } from "./selectors/SectorSelector";
import { RoleSelector } from "./selectors/RoleSelector";
import { EmployeeSelector } from "./selectors/EmployeeSelector";
import { TemplateSelector } from "./selectors/TemplateSelector";
import { toast } from "sonner";

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
  onSave: () => Promise<boolean> | boolean; // Returns boolean
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
    onEmployeeSelect(""); 
  };

  const handleSectorChange = (value: string) => {
    setIsSaved(false);
    setSelectedSector(value);
    setSelectedRole(null);
    onEmployeeSelect("");
  };

  const handleRoleChange = (value: string) => {
    setIsSaved(false);
    setSelectedRole(value);
    onEmployeeSelect("");
  };

  const handleSave = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }
    
    try {
      const result = await onSave();
      if (result) {
        setIsSaved(true);
        toast.success("Avaliação salva com sucesso!");
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Erro ao salvar avaliação");
    }
  };

  const handleClose = () => {
    setIsSaved(false);
    setSelectedCompany(null);
    setSelectedSector(null);
    setSelectedRole(null);
    onEmployeeSelect("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="w-full">
            <TemplateSelector 
              selectedEmployee={selectedEmployee}
              templates={templates}
              isTemplatesLoading={isTemplatesLoading}
              onTemplateSelect={onTemplateSelect}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>

            {!isSaved && (
              <Button
                onClick={handleSave}
                disabled={!selectedEmployee || !selectedTemplate}
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            )}
            
            {isSaved && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    onGenerateLink();
                    handleClose();
                  }}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Gerar Link
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    onScheduleAssessment();
                    handleClose();
                  }}
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Agendar
                </Button>
                
                <Button
                  onClick={() => {
                    onSendEmail();
                    handleClose();
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar por Email
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
