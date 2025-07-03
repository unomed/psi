import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TemplateSelectionForScheduling } from "@/components/assessment-scheduling/TemplateSelectionForScheduling";
import { CandidateSelectionStep } from "./CandidateSelectionStep";
import { CandidateSchedulingDetailsStep } from "./CandidateSchedulingDetailsStep";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { useAssessmentSchedulingWithAutomation } from "@/hooks/assessment-scheduling/useAssessmentSchedulingWithAutomation";

interface CandidateSchedulingWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: string | null;
}

export function CandidateSchedulingWorkflow({ 
  isOpen, 
  onClose, 
  selectedCompany 
}: CandidateSchedulingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<'template' | 'candidate' | 'scheduling'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const {
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading
  } = useAssessmentSchedulingWithAutomation();

  const handleNext = () => {
    if (currentStep === 'template' && selectedTemplate) {
      setCurrentStep('candidate');
    } else if (currentStep === 'candidate' && selectedCandidate) {
      setCurrentStep('scheduling');
    }
  };

  const handleBack = () => {
    if (currentStep === 'scheduling') {
      setCurrentStep('candidate');
    } else if (currentStep === 'candidate') {
      setCurrentStep('template');
    }
  };

  const handleTemplateSelect = (template: ChecklistTemplate) => {
    console.log("📋 Template selecionado para candidato:", template.title);
    setSelectedTemplate(template);
    // Automaticamente avançar para próximo step
    setTimeout(() => {
      setCurrentStep('candidate');
    }, 500);
  };

  const handleSchedule = async (recurrenceType: RecurrenceType, phoneNumber: string) => {
    if (!selectedCandidate || !selectedTemplate || !schedulingDetails.scheduledDate) {
      toast.error("Selecione um candidato, template e data para continuar");
      return;
    }

    try {
      console.log("🔄 Agendando avaliação para candidato:", {
        candidate: selectedCandidate.name,
        template: selectedTemplate.title,
        date: schedulingDetails.scheduledDate
      });

      await scheduleAssessment({
        employee: selectedCandidate, // Candidatos são armazenados como employees
        checklist: selectedTemplate,
        schedulingDetails: {
          scheduledDate: schedulingDetails.scheduledDate,
          recurrenceType,
          phoneNumber,
          sendEmail: schedulingDetails.sendEmail,
          sendWhatsApp: schedulingDetails.sendWhatsApp
        }
      });
      
      toast.success("Avaliação agendada para candidato!", {
        description: `${selectedTemplate.title} agendada para ${selectedCandidate.name}`
      });
      handleClose();
    } catch (error) {
      console.error("❌ Erro ao agendar avaliação para candidato:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao agendar avaliação");
    }
  };

  const handleClose = () => {
    setCurrentStep('template');
    setSelectedTemplate(null);
    setSelectedCandidate(null);
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
    if (currentStep === 'candidate') return !selectedCandidate;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Agendar Avaliação para Candidato</DialogTitle>
          <DialogDescription>
            Selecione um template de avaliação, candidato e configure os detalhes do agendamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template" disabled={currentStep !== 'template'}>
                1. Template
              </TabsTrigger>
              <TabsTrigger value="candidate" disabled={currentStep !== 'candidate'}>
                2. Candidato
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

            <TabsContent value="candidate" className="mt-6">
              <CandidateSelectionStep
                selectedCandidate={selectedCandidate}
                onCandidateSelect={setSelectedCandidate}
                selectedCompany={selectedCompany}
              />
            </TabsContent>

            <TabsContent value="scheduling" className="mt-6">
              <CandidateSchedulingDetailsStep
                candidateName={selectedCandidate?.name || ""}
                candidateEmail={selectedCandidate?.email}
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

          {currentStep === 'candidate' && (
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