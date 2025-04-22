
import { useQuery } from "@tanstack/react-query";
import { fetchChecklistTemplates } from "@/services/checklist";
import { useAssessmentState } from "@/hooks/useAssessmentState";
import { useAssessmentDialogs } from "@/hooks/assessments/useAssessmentDialogs";
import { useAssessmentSelection } from "@/hooks/assessments/useAssessmentSelection";
import { useAssessmentHandlers } from "@/hooks/assessments/useAssessmentHandlers";
import { AssessmentErrorBoundary } from "@/components/assessments/error-boundary/AssessmentErrorBoundary";

// Components
import { AssessmentActions } from "@/components/assessments/AssessmentActions";
import { AssessmentTabs } from "@/components/assessments/AssessmentTabs";
import { AssessmentDialogsContainer } from "@/components/assessments/handlers/AssessmentDialogsContainer";
import { ChecklistTemplate } from "@/types";

interface AssessmentHandlerRootProps {
  companyId: string | null;
  onShareAssessment?: (assessment: any) => Promise<void>;
}

export function AssessmentHandlerRoot({ companyId, onShareAssessment }: AssessmentHandlerRootProps) {
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
    queryKey: ['checklistTemplates', companyId],
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

  // Custom share handler that uses the passed onShareAssessment if provided
  const handleShareAssessment = async (assessmentId: string) => {
    if (onShareAssessment) {
      const assessment = scheduledAssessments.find(a => a.id === assessmentId);
      if (assessment) {
        await onShareAssessment(assessment);
      }
    } else {
      handlers.handleShareAssessment(assessmentId);
    }
  };

  return (
    <AssessmentErrorBoundary>
      <div className="space-y-8">
        <AssessmentActions onNewAssessment={handlers.handleNewAssessment} />
        <AssessmentTabs companyId={companyId} onShareAssessment={handleShareAssessment} />
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
    </AssessmentErrorBoundary>
  );
}
