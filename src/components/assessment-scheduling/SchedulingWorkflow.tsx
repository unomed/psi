
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChecklistSelectionStep } from "./ChecklistSelectionStep";
import { EmployeeSelectionStep } from "./EmployeeSelectionStep";
import { SchedulingDetailsStep } from "./steps/SchedulingDetailsStep";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { useAssessmentSchedulingWithAutomation } from "@/hooks/assessment-scheduling/useAssessmentSchedulingWithAutomation";

interface SchedulingWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchedulingWorkflow({ isOpen, onClose }: SchedulingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<'checklist' | 'employee' | 'scheduling'>('checklist');
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistTemplate | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const {
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading
  } = useAssessmentSchedulingWithAutomation();

  const handleNext = () => {
    if (currentStep === 'checklist' && selectedChecklist) {
      setCurrentStep('employee');
    } else if (currentStep === 'employee' && selectedEmployee) {
      setCurrentStep('scheduling');
    }
  };

  const handleBack = () => {
    if (currentStep === 'scheduling') {
      setCurrentStep('employee');
    } else if (currentStep === 'employee') {
      setCurrentStep('checklist');
    }
  };

  const handleSchedule = async (recurrenceType: RecurrenceType, phoneNumber: string) => {
    if (!selectedEmployee || !selectedChecklist || !schedulingDetails.scheduledDate) {
      toast.error("Selecione um funcionário, checklist e data para continuar");
      return;
    }

    console.log('Iniciando agendamento com dados:', {
      selectedEmployee,
      selectedChecklist,
      schedulingDetails: {
        ...schedulingDetails,
        recurrenceType,
        phoneNumber
      }
    });

    try {
      // Preparar dados para agendamento com parâmetros atualizados
      const scheduleParams = {
        employee: selectedEmployee,
        checklist: selectedChecklist,
        schedulingDetails: {
          scheduledDate: schedulingDetails.scheduledDate,
          recurrenceType,
          phoneNumber,
          sendEmail: schedulingDetails.sendEmail,
          sendWhatsApp: schedulingDetails.sendWhatsApp
        }
      };

      console.log('Chamando scheduleAssessment com parâmetros:', scheduleParams);

      await scheduleAssessment(scheduleParams);
      
      toast.success("Avaliação agendada com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Erro ao agendar:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao agendar avaliação");
    }
  };

  const handleClose = () => {
    setCurrentStep('checklist');
    setSelectedChecklist(null);
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
    if (currentStep === 'checklist') return !selectedChecklist;
    if (currentStep === 'employee') return !selectedEmployee;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Nova Avaliação</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checklist" disabled={currentStep !== 'checklist'}>
                1. Checklist
              </TabsTrigger>
              <TabsTrigger value="employee" disabled={currentStep !== 'employee'}>
                2. Funcionário
              </TabsTrigger>
              <TabsTrigger value="scheduling" disabled={currentStep !== 'scheduling'}>
                3. Agendamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="mt-6">
              <ChecklistSelectionStep
                selectedChecklist={selectedChecklist}
                onChecklistSelect={setSelectedChecklist}
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
                templateTitle={selectedChecklist?.title}
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

          {currentStep !== 'scheduling' && (
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 'checklist'}
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
