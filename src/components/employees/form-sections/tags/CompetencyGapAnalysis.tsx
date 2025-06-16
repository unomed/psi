
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown, Clock, Target } from "lucide-react";
import { useCompetencyGapAnalysis } from "@/hooks/useCompetencyGapAnalysis";

interface CompetencyGapAnalysisProps {
  employeeId?: string;
  roleId?: string;
}

export function CompetencyGapAnalysis({ employeeId, roleId }: CompetencyGapAnalysisProps) {
  const { 
    competencyGaps, 
    trainingNeeds, 
    isLoading, 
    totalGaps, 
    criticalGaps 
  } = useCompetencyGapAnalysis(employeeId, roleId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Analisando Gaps de Competências...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análise de Gaps de Competências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalGaps}</div>
              <div className="text-sm text-muted-foreground">Total de Gaps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{criticalGaps}</div>
              <div className="text-sm text-muted-foreground">Gaps Críticos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{trainingNeeds.length}</div>
              <div className="text-sm text-muted-foreground">Treinamentos Sugeridos</div>
            </div>
          </div>

          {criticalGaps > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {criticalGaps} gaps críticos identificados. Ação imediata recomendada.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Gaps por Categoria */}
      {competencyGaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Gaps Identificados por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competencyGaps.map((gap, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{gap.category}</h4>
                  <Badge variant={getSeverityVariant(gap.severity)}>
                    {gap.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{gap.impact}</p>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Competências em falta:</div>
                  <div className="flex flex-wrap gap-1">
                    {gap.missingTags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-medium mb-1">Recomendações:</div>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {gap.recommendations.map((rec, recIndex) => (
                      <li key={recIndex}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Necessidades de Treinamento Preditivas */}
      {trainingNeeds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Plano de Desenvolvimento Sugerido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainingNeeds.slice(0, 3).map((need, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{need.tagName}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {need.estimatedTimeHours}h estimadas
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Prioridade</span>
                    <span>{need.priority}%</span>
                  </div>
                  <Progress value={need.priority} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recursos sugeridos:</div>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {need.suggestedResources.map((resource, resIndex) => (
                      <li key={resIndex}>{resource}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Prazo sugerido: {new Date(need.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
