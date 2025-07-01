
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentTable } from "./assessments/AssessmentTable";
import { AssessmentLoading } from "./assessments/AssessmentLoading";
import { useAssessments } from "./assessments/useAssessments";

interface RecentAssessmentsProps {
  companyId: string | null;
}

export function RecentAssessments({ companyId }: RecentAssessmentsProps) {
  const { assessments, loading } = useAssessments(companyId);

  if (loading) {
    return <AssessmentLoading />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Avaliações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <AssessmentTable assessments={assessments} />
      </CardContent>
    </Card>
  );
}
