
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EmployeeSelectionStep } from "./steps/EmployeeSelectionStep";
import { TemplateSelectionStep } from "./steps/TemplateSelectionStep";
import { SchedulingDetailsStep } from "./steps/SchedulingDetailsStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import { toast } from "sonner";
import { useAssessmentScheduling } from "@/hooks/assessment-scheduling/useAssessmentScheduling";

interface SchedulingWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchedulingWorkflow({ isOpen, onClose }: SchedulingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    selectedEmployee,
    setSelectedEmployee,
    selectedTemplate,
    setSelectedTemplate,
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading
  } = useAssessmentScheduling();

  const steps = [
    { number: 1, title: "Funcionário", description: "Selecionar funcionário" },
    { number: 2, title: "Template", description: "Escolher modelo de avaliação" },
    { number: 3, title: "Detalhes", description: "Configurar agendamento" },
    { number: 4, title: "Confirmação", description: "Revisar e confirmar" }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = async () => {
    try {
      await scheduleAssessment();
      toast.success("Avaliação agendada com sucesso!");
      onClose();
      resetForm();
    } catch (error) {
      toast.error("Erro ao agendar avaliação");
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedEmployee(null);
    setSelectedTemplate(null);
    setSchedulingDetails({
      scheduledDate: undefined,
      recurrenceType: "none",
      phoneNumber: "",
      sendEmail: true,
      sendWhatsApp: false
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedEmployee;
      case 2: return !!selectedTemplate;
      case 3: return !!schedulingDetails.scheduledDate;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Nova Avaliação</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.number}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-muted mx-4 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <EmployeeSelectionStep 
              selectedEmployee={selectedEmployee}
              onEmployeeSelect={setSelectedEmployee}
            />
          )}
          {currentStep === 2 && (
            <TemplateSelectionStep 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          )}
          {currentStep === 3 && (
            <SchedulingDetailsStep 
              details={schedulingDetails}
              onDetailsChange={setSchedulingDetails}
            />
          )}
          {currentStep === 4 && (
            <ConfirmationStep 
              employee={selectedEmployee}
              template={selectedTemplate}
              details={schedulingDetails}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          {currentStep < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
