
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatDateTime } from "@/utils/dateFormat";

interface RecentAssessmentsRealProps {
  companyId: string | null;
}

export function RecentAssessmentsReal({ companyId }: RecentAssessmentsRealProps) {
  const { recentAssessments, isLoading } = useDashboardData(companyId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Avaliações Recentes
        </CardTitle>
        <Link to="/assessment-results">
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentAssessments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma avaliação encontrada
          </div>
        ) : (
          <div className="space-y-3">
            {recentAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{assessment.employeeName}</p>
                    <Badge
                      variant={
                        assessment.riskLevel === 'Alto' ? 'destructive' :
                        assessment.riskLevel === 'Médio' ? 'secondary' :
                        'default'
                      }
                      className="text-xs"
                    >
                      {assessment.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{assessment.sector}</span>
                    <span>{formatDateTime(assessment.completedAt)}</span>
                    {assessment.dominantFactor && (
                      <span>Perfil: {assessment.dominantFactor}</span>
                    )}
                  </div>
                </div>
                
                <Link to={`/assessment-results`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
