
import { useAssessmentHandlers } from "@/hooks/assessments/useAssessmentHandlers";
import { useAssessmentDialogs } from "@/hooks/assessments/useAssessmentDialogs";
import { ChecklistTemplate } from "@/types";
import { NewAssessmentDialog } from "@/components/assessments/NewAssessmentDialog";
import { AssessmentDialogs } from "@/components/assessments/AssessmentDialogs";
import { ScheduleRecurringAssessmentDialog } from "@/components/assessments/ScheduleRecurringAssessmentDialog";
import { GenerateLinkDialog } from "@/components/assessments/GenerateLinkDialog";
import { ShareAssessmentDialog } from "@/components/assessments/ShareAssessmentDialog";

interface AssessmentDialogsContainerProps {
  dialogState: ReturnType<typeof useAssessmentDialogs>;
  handlers: ReturnType<typeof useAssessmentHandlers>;
  data: {
    selectedEmployee: string | null;
    selectedTemplate: ChecklistTemplate | null;
    templates: ChecklistTemplate[];
    isTemplatesLoading: boolean;
    scheduledDate: Date | undefined;
  };
  onEmployeeChange: (value: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onDateSelect: (date: Date | undefined) => void;
}

export function AssessmentDialogsContainer({
  dialogState,
  handlers,
  data,
  onEmployeeChange,
  onTemplateSelect,
  onDateSelect
}: AssessmentDialogsContainerProps) {
  const {
    isNewAssessmentDialogOpen,
    setIsNewAssessmentDialogOpen,
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
    assessmentResult,
    generatedLink,
    selectedAssessment
  } = dialogState;

  return (
    <>
      <NewAssessmentDialog
        isOpen={isNewAssessmentDialogOpen}
        onClose={() => setIsNewAssessmentDialogOpen(false)}
        selectedEmployee={data.selectedEmployee}
        selectedTemplate={data.selectedTemplate}
        templates={data.templates}
        isTemplatesLoading={data.isTemplatesLoading}
        onScheduleAssessment={handlers.handleScheduleAssessment}
        onGenerateLink={handlers.handleGenerateLink}
        onSendEmail={handlers.handleSendEmailToEmployee}
        onEmployeeSelect={onEmployeeChange}
        onTemplateSelect={onTemplateSelect}
        onSave={handlers.handleSaveAssessment}
      />
      
      <AssessmentDialogs
        isAssessmentDialogOpen={isAssessmentDialogOpen}
        onAssessmentDialogClose={() => setIsAssessmentDialogOpen(false)}
        isResultDialogOpen={isResultDialogOpen}
        onResultDialogClose={() => setIsResultDialogOpen(false)}
        selectedTemplate={data.selectedTemplate}
        assessmentResult={assessmentResult}
        onSubmitAssessment={handlers.handleSubmitAssessment}
        onCloseResult={handlers.handleCloseResult}
        employeeName={handlers.getSelectedEmployeeName(data.selectedEmployee)}
      />
      
      <ScheduleRecurringAssessmentDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        selectedEmployeeId={data.selectedEmployee}
        selectedTemplate={data.selectedTemplate}
        scheduledDate={data.scheduledDate}
        onDateSelect={onDateSelect}
        onSave={handlers.handleSaveSchedule}
      />
      
      <GenerateLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        selectedEmployeeId={data.selectedEmployee}
        selectedTemplate={data.selectedTemplate}
        generatedLink={generatedLink}
      />
      
      <ShareAssessmentDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        assessment={selectedAssessment}
        templates={data.templates}
      />
    </>
  );
}
