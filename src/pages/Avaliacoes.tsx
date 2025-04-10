
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchChecklistTemplates, saveScheduledAssessment } from "@/services/checklistService";
import { ChecklistResult, ChecklistTemplate, ScheduledAssessment, AssessmentStatus } from "@/types/checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new components
import { AssessmentSelectionForm, mockEmployees } from "@/components/assessments/AssessmentSelectionForm";
import { ScheduledAssessmentsList } from "@/components/assessments/ScheduledAssessmentsList";
import { ScheduleAssessmentDialog } from "@/components/assessments/ScheduleAssessmentDialog";
import { GenerateLinkDialog } from "@/components/assessments/GenerateLinkDialog";
import { AssessmentDialogs } from "@/components/assessments/AssessmentDialogs";
import { 
  generateAssessmentLink, 
  getEmployeeInfo,
  sendAssessmentEmail 
} from "@/components/assessments/assessmentUtils";

// Mock data for scheduled assessments (in a real app, this would come from a database)
const mockScheduledAssessments: ScheduledAssessment[] = [
  {
    id: "sched-1",
    employeeId: "emp-1",
    templateId: "template-1",
    scheduledDate: new Date("2025-04-15"),
    sentAt: new Date("2025-04-10"),
    linkUrl: "https://example.com/assessment/link1",
    status: "sent",
    completedAt: null
  },
  {
    id: "sched-2",
    employeeId: "emp-2",
    templateId: "template-2",
    scheduledDate: new Date("2025-04-20"),
    sentAt: null,
    linkUrl: "",
    status: "scheduled",
    completedAt: null
  }
];

export default function Avaliacoes() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<ChecklistResult | null>(null);
  const [scheduledAssessments, setScheduledAssessments] = useState<ScheduledAssessment[]>(mockScheduledAssessments);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("nova");

  // Fetch checklist templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: fetchChecklistTemplates
  });

  // Handle selection changes
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleStartAssessment = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para iniciar a avaliação.");
      return;
    }
    
    setIsAssessmentDialogOpen(true);
  };

  const handleScheduleAssessment = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para agendar a avaliação.");
      return;
    }
    
    setIsScheduleDialogOpen(true);
  };

  const handleGenerateLink = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para gerar o link.");
      return;
    }
    
    // In a real app, this would generate a unique link with a token in the database
    const newLink = generateAssessmentLink(selectedTemplate.id, selectedEmployee);
    setGeneratedLink(newLink);
    setIsLinkDialogOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedEmployee || !selectedTemplate || !scheduledDate) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    try {
      // Create new scheduled assessment
      const employee = mockEmployees.find(e => e.id === selectedEmployee);
      if (!employee) {
        toast.error("Funcionário não encontrado.");
        return;
      }
      
      const newScheduledAssessment: Omit<ScheduledAssessment, "id"> = {
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: scheduledDate,
        sentAt: null,
        linkUrl: "",
        status: "scheduled",
        completedAt: null
      };
      
      // In a real app, this would save to the database
      const savedId = await saveScheduledAssessment(newScheduledAssessment);
      
      const assessmentWithId: ScheduledAssessment = {
        ...newScheduledAssessment,
        id: savedId || `sched-${Date.now()}`
      };
      
      setScheduledAssessments([...scheduledAssessments, assessmentWithId]);
      setIsScheduleDialogOpen(false);
      setScheduledDate(undefined);
      toast.success("Avaliação agendada com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar avaliação:", error);
      toast.error("Erro ao agendar avaliação. Tente novamente mais tarde.");
    }
  };

  const handleSendEmail = async (scheduledAssessmentId: string) => {
    try {
      const updatedAssessments = await sendAssessmentEmail(scheduledAssessmentId, scheduledAssessments);
      setScheduledAssessments(updatedAssessments);
      
      // Find the employee to display in the toast
      const assessment = scheduledAssessments.find(a => a.id === scheduledAssessmentId);
      if (assessment) {
        const employee = mockEmployees.find(e => e.id === assessment.employeeId);
        if (employee) {
          toast.success(`Email enviado para ${employee.name} (${employee.email})`);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar email. Tente novamente mais tarde.");
    }
  };

  const handleSubmitAssessment = (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    // In a real app, this would save the assessment to the database
    const mockResult: ChecklistResult = {
      ...resultData,
      id: `result-${Date.now()}`,
      completedAt: new Date()
    };
    
    setAssessmentResult(mockResult);
    setIsAssessmentDialogOpen(false);
    setIsResultDialogOpen(true);
    
    toast.success("Avaliação concluída com sucesso!");
  };

  const handleCloseResult = () => {
    setIsResultDialogOpen(false);
    setAssessmentResult(null);
  };

  const getSelectedEmployeeName = () => {
    return getEmployeeInfo(selectedEmployee).name;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Aplicação e registro de avaliações psicossociais individuais e coletivas.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="nova">Nova Avaliação</TabsTrigger>
          <TabsTrigger value="agendadas">Avaliações Agendadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nova" className="space-y-4">
          <Card className="p-6">
            <AssessmentSelectionForm
              selectedEmployee={selectedEmployee}
              selectedTemplate={selectedTemplate}
              templates={templates}
              isTemplatesLoading={isLoading}
              onStartAssessment={handleStartAssessment}
              onScheduleAssessment={handleScheduleAssessment}
              onGenerateLink={handleGenerateLink}
              onEmployeeSelect={handleEmployeeChange}
              onTemplateSelect={handleTemplateSelect}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="agendadas" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Avaliações Agendadas</h2>
              
              <ScheduledAssessmentsList
                scheduledAssessments={scheduledAssessments}
                onSendEmail={handleSendEmail}
                templates={templates}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Assessment Dialogs */}
      <AssessmentDialogs
        isAssessmentDialogOpen={isAssessmentDialogOpen}
        onAssessmentDialogClose={() => setIsAssessmentDialogOpen(false)}
        isResultDialogOpen={isResultDialogOpen}
        onResultDialogClose={() => setIsResultDialogOpen(false)}
        selectedTemplate={selectedTemplate}
        assessmentResult={assessmentResult}
        onSubmitAssessment={handleSubmitAssessment}
        onCloseResult={handleCloseResult}
        employeeName={getSelectedEmployeeName()}
      />
      
      {/* Schedule Dialog */}
      <ScheduleAssessmentDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        selectedEmployeeId={selectedEmployee}
        selectedTemplate={selectedTemplate}
        scheduledDate={scheduledDate}
        onDateSelect={setScheduledDate}
        onSave={handleSaveSchedule}
      />
      
      {/* Link Dialog */}
      <GenerateLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        selectedEmployeeId={selectedEmployee}
        selectedTemplate={selectedTemplate}
        generatedLink={generatedLink}
      />
    </div>
  );
}
