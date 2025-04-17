
import { useQuery } from "@tanstack/react-query";
import { ChecklistResult } from "@/types/checklist";
import { fetchChecklistTemplates } from "@/services/checklistService";
import { useAssessmentState } from "@/hooks/useAssessmentState";
import { useAssessmentDialogs } from "@/hooks/assessments/useAssessmentDialogs";
import { useAssessmentSelection } from "@/hooks/assessments/useAssessmentSelection";

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
    scheduledAssessments,
    handleSaveSchedule: saveSchedule,
    handleSendEmail
  } = useAssessmentState();

  const {
    selectedEmployee,
    setSelectedEmployee,
    selectedTemplate,
    setSelectedTemplate,
    scheduledDate,
    setScheduledDate,
    activeTab,
    setActiveTab
  } = useAssessmentSelection();

  const {
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
    generatedLink,
    setGeneratedLink,
    selectedAssessment,
    setSelectedAssessment
  } = useAssessmentDialogs();

  // Fetch checklist templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: fetchChecklistTemplates
  });

  // Import handlers
  const {
    handleNewAssessment,
    handleScheduleAssessment,
    handleGenerateLink,
    handleShareAssessment,
    handleSubmitAssessment,
    handleCloseResult,
    getSelectedEmployeeName,
    handleSaveAssessment,
    handleSendEmailToEmployee,
    handleSaveSchedule
  } = useHandlers();

  // Custom hook to use the handlers but avoid circular dependencies
  function useHandlers() {
    const { handleSendEmail } = useAssessmentState();
    
    // Import the useAssessmentHandlers hook
    const handlers = {
      handleNewAssessment: () => {
        setSelectedEmployee(null);
        setSelectedTemplate(null);
        setIsNewAssessmentDialogOpen(true);
      },
      
      handleScheduleAssessment: () => {
        if (!selectedEmployee || !selectedTemplate) {
          return;
        }
        setIsScheduleDialogOpen(true);
      },
      
      handleGenerateLink: () => {
        if (!selectedEmployee || !selectedTemplate) {
          return;
        }
        const link = `${window.location.origin}/avaliacao/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        setGeneratedLink(link);
        setIsLinkDialogOpen(true);
      },
      
      handleShareAssessment: (assessmentId: string) => {
        const assessment = scheduledAssessments.find(a => a.id === assessmentId);
        if (assessment) {
          setSelectedAssessment(assessment);
          setIsShareDialogOpen(true);
        }
      },
      
      handleSubmitAssessment: (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
        const result = {
          ...resultData,
          id: `result-${Date.now()}`,
          completedAt: new Date()
        };
        setAssessmentResult(result);
        setIsAssessmentDialogOpen(false);
        setIsResultDialogOpen(true);
      },
      
      handleCloseResult: () => {
        setIsResultDialogOpen(false);
        setAssessmentResult(null);
      },
      
      getSelectedEmployeeName: () => {
        if (!selectedEmployee) return "";
        const mockEmployees = [{id: "emp-1", name: "John Doe"}]; // Simplified for the handler
        return mockEmployees.find(e => e.id === selectedEmployee)?.name || "";
      },
      
      handleSaveAssessment,
      
      handleSendEmailToEmployee: () => {
        if (!selectedEmployee) return;
        handleSendEmail(selectedEmployee);
        setIsNewAssessmentDialogOpen(false);
        setActiveTab("agendadas");
      },
      
      handleSaveSchedule: (recurrenceType, phoneNumber) => {
        saveSchedule(recurrenceType, phoneNumber);
        setIsScheduleDialogOpen(false);
        setIsNewAssessmentDialogOpen(false);
      }
    };
    
    return handlers;
  }

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
