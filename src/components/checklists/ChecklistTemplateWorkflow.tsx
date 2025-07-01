
import { useState } from "react";
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'selector' 
              ? "Criar Novo Questionário" 
              : `Personalizar: ${selectedTemplate?.title || "Template"}`
            }
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {step === 'selector' && !isEditing ? (
            <QuestionnaireTemplateSelector
              onSelectTemplate={handleTemplateSelect}
              onCancel={handleClose}
            />
          ) : (
            <ChecklistTemplateForm
              defaultValues={selectedTemplate || existingTemplate}
              onSubmit={handleFormSubmit}
              onCancel={step === 'form' ? handleBackToSelector : handleClose}
              existingTemplate={existingTemplate}
              isEditing={isEditing}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
