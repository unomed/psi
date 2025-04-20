
import { AssessmentHandlerRoot } from "./handlers/AssessmentHandlerRoot";

interface AssessmentHandlerProps {
  companyId: string | null;
  onShareAssessment?: (assessment: any) => Promise<void>;
}

export function AssessmentHandler({ companyId, onShareAssessment }: AssessmentHandlerProps) {
  return <AssessmentHandlerRoot companyId={companyId} onShareAssessment={onShareAssessment} />;
}
