
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TemplateSelectionForScheduling } from "./TemplateSelectionForScheduling";
import { EmployeeSelectionStep } from "./EmployeeSelectionStep";
import { SchedulingDetailsStep } from "./steps/SchedulingDetailsStep";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { useAssessmentSchedulingWithAutomation } from "@/hooks/assessment-scheduling/useAssessmentSchedulingWithAutomation";

interface SchedulingWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  schedulingType?: 'individual' | 'collective';
}

export function SchedulingWorkflow({ isOpen, onClose, schedulingType = 'individual' }: SchedulingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<'template' | 'employee' | 'scheduling'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const {
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading
  } = useAssessmentSchedulingWithAutomation();

  const handleNext = () => {
    if (currentStep === 'template' && selectedTemplate) {
      setCurrentStep('employee');
    } else if (currentStep === 'employee' && selectedEmployee) {
      setCurrentStep('scheduling');
    }
  };

  const handleBack = () => {
    if (currentStep === 'scheduling') {
      setCurrentStep('employee');
    } else if (currentStep === 'employee') {
      setCurrentStep('template');
    }
  };

  const handleTemplateSelect = (template: ChecklistTemplate) => {
    console.log("📋 Template selecionado no workflow:", template.title);
    setSelectedTemplate(template);
    // Automaticamente avançar para próximo step
    setTimeout(() => {
      setCurrentStep('employee');
    }, 500);
  };

  const handleSchedule = async (recurrenceType: RecurrenceType, phoneNumber: string) => {
    if (!selectedEmployee || !selectedTemplate || !schedulingDetails.scheduledDate) {
      toast.error("Selecione um funcionário, template e data para continuar");
      return;
    }

    try {
      console.log("🔄 Agendando avaliação:", {
        employee: selectedEmployee.name,
        template: selectedTemplate.title,
        date: schedulingDetails.scheduledDate
      });

      await scheduleAssessment({
        employee: selectedEmployee,
        checklist: selectedTemplate,
        schedulingDetails: {
          scheduledDate: schedulingDetails.scheduledDate,
          recurrenceType,
          phoneNumber,
          sendEmail: schedulingDetails.sendEmail,
          sendWhatsApp: schedulingDetails.sendWhatsApp
        }
      });
      
      toast.success("Avaliação agendada com sucesso!", {
        description: `${selectedTemplate.title} agendada para ${selectedEmployee.name}`
      });
      handleClose();
    } catch (error) {
      console.error("❌ Erro ao agendar:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao agendar avaliação");
    }
  };

  const handleClose = () => {
    setCurrentStep('template');
    setSelectedTemplate(null);
    setSelectedEmployee(null);
    setSchedulingDetails({
      scheduledDate: new Date(),
      recurrenceType: "none",
      phoneNumber: "",
      sendEmail: true,
      sendWhatsApp: false
    });
    onClose();
  };

  const isNextDisabled = () => {
    if (currentStep === 'template') return !selectedTemplate;
    if (currentStep === 'employee') return !selectedEmployee;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Agendar Nova Avaliação</DialogTitle>
          <DialogDescription>
            Selecione um template de avaliação, funcionário e configure os detalhes do agendamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template" disabled={currentStep !== 'template'}>
                1. Template
              </TabsTrigger>
              <TabsTrigger value="employee" disabled={currentStep !== 'employee'}>
                2. Funcionário
              </TabsTrigger>
              <TabsTrigger value="scheduling" disabled={currentStep !== 'scheduling'}>
                3. Agendamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="mt-6">
              <TemplateSelectionForScheduling
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
                onBack={handleBack}
              />
            </TabsContent>

            <TabsContent value="employee" className="mt-6">
              <EmployeeSelectionStep
                selectedEmployee={selectedEmployee}
                onEmployeeSelect={setSelectedEmployee}
              />
            </TabsContent>

            <TabsContent value="scheduling" className="mt-6">
              <SchedulingDetailsStep
                employeeName={selectedEmployee?.name || ""}
                employeeEmail={selectedEmployee?.email}
                templateTitle={selectedTemplate?.title}
                scheduledDate={schedulingDetails.scheduledDate}
                onDateSelect={(date) => setSchedulingDetails(prev => ({ 
                  ...prev, 
                  scheduledDate: date || new Date() 
                }))}
                onBack={handleBack}
                onSchedule={handleSchedule}
              />
            </TabsContent>
          </Tabs>

          {currentStep === 'employee' && (
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isNextDisabled()}
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
