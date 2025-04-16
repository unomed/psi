import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChecklistResult } from "@/types/checklist";
import { fetchChecklistTemplates, saveScheduledAssessment } from "@/services/checklistService";
import { generateAssessmentLink, getEmployeeInfo } from "@/components/assessments/assessmentUtils";
import { useAssessmentState } from "@/hooks/useAssessmentState";

// Components
import { AssessmentActions } from "@/components/assessments/AssessmentActions";
import { AssessmentTabs } from "@/components/assessments/AssessmentTabs";
import { AssessmentDialogs } from "@/components/assessments/AssessmentDialogs";
import { ScheduleRecurringAssessmentDialog } from "@/components/assessments/ScheduleRecurringAssessmentDialog";
import { GenerateLinkDialog } from "@/components/assessments/GenerateLinkDialog";
import { ShareAssessmentDialog } from "@/components/assessments/ShareAssessmentDialog";
import { NewAssessmentDialog } from "@/components/assessments/NewAssessmentDialog";

export function AssessmentHandler() {
  const {
    selectedEmployee,
    setSelectedEmployee,
    selectedTemplate,
    setSelectedTemplate,
    scheduledDate,
    setScheduledDate,
    isAssessmentDialogOpen,
    setIsAssessmentDialogOpen,
    isResultDialogOpen,
    setIsResultDialogOpen,
    isScheduleDialogOpen,
    setIsScheduleDialogOpen,
    isLinkDialogOpen,
    setIsLinkDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isNewAssessmentDialogOpen,
    setIsNewAssessmentDialogOpen,
    assessmentResult,
    setAssessmentResult,
    scheduledAssessments,
    generatedLink,
    setGeneratedLink,
    activeTab,
    setActiveTab,
    selectedAssessment,
    setSelectedAssessment,
    handleSaveSchedule,
    handleSendEmail
  } = useAssessmentState();

  // Fetch checklist templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: fetchChecklistTemplates
  });

  // Handlers
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleNewAssessment = () => {
    setSelectedEmployee(null);
    setSelectedTemplate(null);
    setIsNewAssessmentDialogOpen(true);
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
    
    const newLink = generateAssessmentLink(selectedTemplate.id, selectedEmployee);
    setGeneratedLink(newLink);
    setIsLinkDialogOpen(true);
  };

  const handleShareAssessment = (assessmentId: string) => {
    const assessment = scheduledAssessments.find(a => a.id === assessmentId);
    if (assessment) {
      setSelectedAssessment(assessment);
      setIsShareDialogOpen(true);
    }
  };

  const handleSubmitAssessment = (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
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

  const handleSaveAssessment = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }

    try {
      await saveScheduledAssessment({
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: new Date(),
        status: "scheduled",
        sentAt: null,
        completedAt: null,
        linkUrl: "",
        recurrenceType: "none"
      });
      
      toast.success("Avaliação salva com sucesso!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Erro ao salvar avaliação.");
    }
  };

  const handleSendEmailToEmployee = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }
    
    handleSendEmail(selectedEmployee);
    setIsNewAssessmentDialogOpen(false);
    setActiveTab("agendadas");
  };

  return (
    <div className="space-y-8">
      <AssessmentActions onNewAssessment={handleNewAssessment} />
      
      <AssessmentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        scheduledAssessments={scheduledAssessments}
        onSendEmail={handleSendEmail}
        onShareAssessment={handleShareAssessment}
        templates={templates}
      />
      
      <NewAssessmentDialog
        isOpen={isNewAssessmentDialogOpen}
        onClose={() => setIsNewAssessmentDialogOpen(false)}
        selectedEmployee={selectedEmployee}
        selectedTemplate={selectedTemplate}
        templates={templates}
        isTemplatesLoading={isLoading}
        onScheduleAssessment={handleScheduleAssessment}
        onGenerateLink={handleGenerateLink}
        onSendEmail={handleSendEmailToEmployee}
        onEmployeeSelect={handleEmployeeChange}
        onTemplateSelect={handleTemplateSelect}
        onSave={handleSaveAssessment}
      />
      
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
      
      <ScheduleRecurringAssessmentDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        selectedEmployeeId={selectedEmployee}
        selectedTemplate={selectedTemplate}
        scheduledDate={scheduledDate}
        onDateSelect={setScheduledDate}
        onSave={handleSaveSchedule}
      />
      
      <GenerateLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        selectedEmployeeId={selectedEmployee}
        selectedTemplate={selectedTemplate}
        generatedLink={generatedLink}
      />
      
      <ShareAssessmentDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        assessment={selectedAssessment}
        templates={templates}
      />
    </div>
  );
}
