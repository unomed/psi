
import { AssessmentHandlerRoot } from "./handlers/AssessmentHandlerRoot";

interface AssessmentHandlerProps {
  companyId: string | null;
}

export function AssessmentHandler({ companyId }: AssessmentHandlerProps) {
  return <AssessmentHandlerRoot companyId={companyId} />;
}
