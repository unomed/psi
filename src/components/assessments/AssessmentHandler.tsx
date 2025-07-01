
import { AssessmentHandlerRoot } from "./handlers/AssessmentHandlerRoot";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";

interface AssessmentHandlerProps {
  companyId: string | null;
  onShareAssessment?: (assessment: any) => Promise<void>;
  onDeleteAssessment?: (assessmentId: string) => Promise<void>;
  onSendEmail?: (assessmentId: string) => Promise<void>;
  isProcessing?: boolean;
}

export function AssessmentHandler({ 
  companyId, 
  onShareAssessment,
  onDeleteAssessment,
  onSendEmail,
  isProcessing 
}: AssessmentHandlerProps) {
  // Custom handler that can be passed to other components
  return (
    <AssessmentHandlerRoot 
      companyId={companyId} 
      onShareAssessment={onShareAssessment}
      onDeleteAssessment={onDeleteAssessment}
      onSendEmail={onSendEmail}
      isProcessing={isProcessing}
    />
  );
}
