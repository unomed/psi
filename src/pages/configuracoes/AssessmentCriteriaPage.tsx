
import { AssessmentCriteriaSettings } from "@/components/settings/AssessmentCriteriaSettings";

export default function AssessmentCriteriaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Critérios de Avaliação</h1>
        <p className="text-muted-foreground mt-2">
          Configure os critérios e níveis de risco para avaliações.
        </p>
      </div>
      <AssessmentCriteriaSettings />
    </div>
  );
}
