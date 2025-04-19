
import { useQuery } from "@tanstack/react-query";
import { fetchChecklistTemplates } from "@/services/checklistService";
import { useAssessmentState } from "@/hooks/useAssessmentState";
import { useAssessmentDialogs } from "@/hooks/assessments/useAssessmentDialogs";
import { useAssessmentSelection } from "@/hooks/assessments/useAssessmentSelection";
import { useAssessmentHandlers } from "@/hooks/assessments/useAssessmentHandlers";

// Components
import { AssessmentActions } from "@/components/assessments/AssessmentActions";
import { AssessmentTabs } from "@/components/assessments/AssessmentTabs";
import { AssessmentDialogsContainer } from "@/components/assessments/handlers/AssessmentDialogsContainer";

export function AssessmentHandlerRoot() {
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

  const dialogState = useAssessmentDialogs();

  // Fetch checklist templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: fetchChecklistTemplates
  });

  const handlers = useAssessmentHandlers({
    selectedEmployee,
    selectedTemplate,
    setSelectedEmployee,
    setSelectedTemplate,
    ...dialogState,
    setActiveTab,
    scheduledDate,
    setScheduledDate,
    handleSendEmail
  });

  // Basic UI event handlers
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
      <AssessmentActions onNewAssessment={handlers.handleNewAssessment} />
      
      <AssessmentTabs
        scheduledAssessments={scheduledAssessments}
        onSendEmail={handleSendEmail}
        onScheduleAssessment={handlers.handleScheduleNewAssessment}
        onGenerateLink={handlers.handleGenerateLink}
        templates={templates}
        isTemplatesLoading={isLoading}
        selectedEmployee={selectedEmployee}
        selectedTemplate={selectedTemplate}
        onEmployeeSelect={handleEmployeeChange}
        onTemplateSelect={handleTemplateSelect}
        onStartAssessment={handlers.handleStartAssessment}
      />
      
      <AssessmentDialogsContainer
        dialogState={dialogState}
        handlers={handlers}
        data={{
          selectedEmployee,
          selectedTemplate,
          templates,
          isTemplatesLoading: isLoading,
          scheduledDate
        }}
        onEmployeeChange={handleEmployeeChange}
        onTemplateSelect={handleTemplateSelect}
        onDateSelect={setScheduledDate}
      />
    </div>
  );
}
