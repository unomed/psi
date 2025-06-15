
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChecklistTemplate } from "@/types/checklist";
import { AssessmentSelectionForm } from "@/components/assessments/AssessmentSelectionForm";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface StartAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate?: ChecklistTemplate | null;
}

export function StartAssessmentDialog({
  isOpen,
  onClose,
  selectedTemplate
}: StartAssessmentDialogProps) {
  const navigate = useNavigate();
  const { userCompanies } = useAuth();
  const { checklists, isLoading } = useChecklistTemplates();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [currentSelectedTemplate, setCurrentSelectedTemplate] = useState<ChecklistTemplate | null>(selectedTemplate || null);

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = checklists.find(t => t.id === templateId);
    setCurrentSelectedTemplate(template || null);
  };

  const handleStartAssessment = () => {
    if (!selectedEmployee || !currentSelectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de avaliação");
      return;
    }

    // Navegar para a página de avaliação
    navigate(`/assessment/${currentSelectedTemplate.id}/${selectedEmployee}`);
    onClose();
  };

  const handleScheduleAssessment = () => {
    if (!selectedEmployee || !currentSelectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de avaliação");
      return;
    }

    // Navegar para agendamentos
    navigate("/agendamentos");
    onClose();
  };

  const handleGenerateLink = () => {
    if (!selectedEmployee || !currentSelectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de avaliação");
      return;
    }

    // Gerar link de avaliação
    const link = `${window.location.origin}/funcionario?template=${currentSelectedTemplate.id}&employee=${selectedEmployee}`;
    
    // Copiar para clipboard
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copiado para a área de transferência!");
    }).catch(() => {
      toast.error("Erro ao copiar link");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Iniciar Avaliação</DialogTitle>
          <DialogDescription>
            {selectedTemplate 
              ? `Configurar avaliação para: ${selectedTemplate.title}`
              : "Selecione um modelo de avaliação e um funcionário para iniciar"
            }
          </DialogDescription>
        </DialogHeader>

        <AssessmentSelectionForm
          selectedEmployee={selectedEmployee}
          selectedTemplate={currentSelectedTemplate}
          templates={checklists || []}
          isTemplatesLoading={isLoading}
          onStartAssessment={handleStartAssessment}
          onScheduleAssessment={handleScheduleAssessment}
          onGenerateLink={handleGenerateLink}
          onEmployeeSelect={handleEmployeeSelect}
          onTemplateSelect={handleTemplateSelect}
        />
      </DialogContent>
    </Dialog>
  );
}
