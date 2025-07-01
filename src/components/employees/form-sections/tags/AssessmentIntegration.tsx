
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, Star, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AssessmentIntegrationProps {
  employeeId?: string;
  roleId?: string;
}

export function AssessmentIntegration({ employeeId, roleId }: AssessmentIntegrationProps) {
  // Buscar avaliações do funcionário
  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['assessment-integration', employeeId],
    queryFn: async () => {
      if (!employeeId) return null;

      const { data: responses, error } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          template:checklist_templates(*)
        `)
        .eq('employee_id', employeeId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      // Simular recomendações baseadas em avaliações
      const recommendations = [
        {
          source: 'Avaliação DISC',
          recommendation: 'Desenvolver habilidades de liderança',
          confidence: 0.85,
          suggestedTags: ['Liderança', 'Comunicação', 'Gestão de Equipes'],
          priority: 'high'
        },
        {
          source: 'Avaliação Psicossocial',
          recommendation: 'Fortalecer competências técnicas em análise de dados',
          confidence: 0.72,
          suggestedTags: ['Análise de Dados', 'Excel Avançado', 'Power BI'],
          priority: 'medium'
        },
        {
          source: 'Avaliação de Performance',
          recommendation: 'Desenvolver soft skills para melhor colaboração',
          confidence: 0.68,
          suggestedTags: ['Trabalho em Equipe', 'Empatia', 'Resolução de Conflitos'],
          priority: 'medium'
        }
      ];

      return {
        assessments: responses || [],
        recommendations,
        lastAssessment: responses?.[0],
        totalAssessments: responses?.length || 0
      };
    },
    enabled: !!employeeId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Carregando Integração com Avaliações...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!assessmentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Integração com Sistema de Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma avaliação encontrada para este funcionário.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Resumo das Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Integração com Sistema de Avaliações
            <Badge variant="outline">{assessmentData.totalAssessments} avaliações</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{assessmentData.totalAssessments}</div>
              <div className="text-sm text-muted-foreground">Total de Avaliações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{assessmentData.recommendations.length}</div>
              <div className="text-sm text-muted-foreground">Recomendações IA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {assessmentData.lastAssessment ? 
                  Math.floor((Date.now() - new Date(assessmentData.lastAssessment.completed_at).getTime()) / (1000 * 60 * 60 * 24)) 
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Dias desde última avaliação</div>
            </div>
          </div>

          {assessmentData.lastAssessment && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Última Avaliação:</div>
              <div className="text-sm text-muted-foreground">
                {assessmentData.lastAssessment.template?.title} - {new Date(assessmentData.lastAssessment.completed_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendações Baseadas em Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recomendações Automáticas de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessmentData.recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{rec.recommendation}</div>
                  <div className="text-sm text-muted-foreground">
                    Baseado em: {rec.source}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(rec.priority)}>
                    {rec.priority}
                  </Badge>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Confiança da IA</span>
                  <span>{Math.round(rec.confidence * 100)}%</span>
                </div>
                <Progress value={rec.confidence * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Tags sugeridas:</div>
                <div className="flex flex-wrap gap-1">
                  {rec.suggestedTags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  Aplicar Recomendação
                </Button>
                <Button size="sm" variant="ghost">
                  Ver Detalhes
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Histórico de Avaliações */}
      {assessmentData.assessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Histórico de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessmentData.assessments.slice(0, 5).map((assessment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{assessment.template?.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(assessment.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {assessment.raw_score && (
                      <Badge variant="outline">
                        Score: {Math.round(assessment.raw_score)}
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      Ver Resultado
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
