
import { AssessmentHandler } from "@/components/assessments/AssessmentHandler";
import { AssessmentErrorBoundary } from "@/components/assessments/error-boundary/AssessmentErrorBoundary";

export default function Avaliacoes() {
  return (
    <div className="container mx-auto py-6">
      <AssessmentErrorBoundary>
        <AssessmentHandler />
      </AssessmentErrorBoundary>
    </div>
  );
}
