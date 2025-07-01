
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChecklistTemplateForm } from "./ChecklistTemplateForm";
import { QuestionnaireTemplateSelector } from "./QuestionnaireTemplateSelector";

interface ChecklistTemplateWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  existingTemplate?: any;
  isEditing?: boolean;
}

export function ChecklistTemplateWorkflow({ 
  isOpen, 
  onClose, 
  onSubmit, 
  existingTemplate,
  isEditing = false 
}: ChecklistTemplateWorkflowProps) {
  const [step, setStep] = useState<'selector' | 'form'>('selector');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Efeito para lidar com templates pré-selecionados
  useEffect(() => {
    if (existingTemplate && isOpen) {
      setSelectedTemplate(existingTemplate);
      setStep('form');
    } else if (!existingTemplate && isOpen && !isEditing) {
      setSelectedTemplate(null);
      setStep('selector');
    }
  }, [existingTemplate, isOpen, isEditing]);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setStep('form');
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    setStep('selector');
    setSelectedTemplate(null);
    onClose();
  };

  const handleBackToSelector = () => {
    setStep('selector');
    setSelectedTemplate(null);
  };

  // Determinar o título do diálogo
  const getDialogTitle = () => {
    if (isEditing) {
      return "Editar Questionário";
    }
    
    if (existingTemplate) {
      return `Personalizar: ${existingTemplate.title || "Template Selecionado"}`;
    }
    
    if (step === 'selector') {
      return "Criar Novo Questionário";
    }
    
    return `Personalizar: ${selectedTemplate?.title || "Template"}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {step === 'selector' && !isEditing && !existingTemplate ? (
            <QuestionnaireTemplateSelector
              onSelectTemplate={handleTemplateSelect}
              onCancel={handleClose}
            />
          ) : (
            <ChecklistTemplateForm
              defaultValues={selectedTemplate || existingTemplate}
              onSubmit={handleFormSubmit}
              onCancel={existingTemplate ? handleClose : handleBackToSelector}
              existingTemplate={existingTemplate}
              isEditing={isEditing}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
