import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChecklistResult } from "@/types";

interface DashboardRecentAssessmentsProps {
  results: ChecklistResult[] | undefined;
  completedAssessments: number;
  criticalRisks: number;
}

export function DashboardRecentAssessments({ 
  results, 
  completedAssessments, 
  criticalRisks 
}: DashboardRecentAssessmentsProps) {
  if (completedAssessments === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações Recentes</CardTitle>
        <CardDescription>
          Últimas avaliações completadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results?.slice(0, 5).map((result) => (
            <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{result.employeeName || 'Funcionário'}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(result.completedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Badge 
                variant={criticalRisks > 0 ? "destructive" : "default"}
              >
                {result.dominantFactor}
              </Badge>
            </div>
          ))}
          {results && results.length > 5 && (
            <div className="text-center pt-3">
              <Link to="/relatorios">
                <Button variant="outline" size="sm">
                  Ver todos os resultados
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
