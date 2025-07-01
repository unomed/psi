
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, TrendingUp, Download, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PredictiveReportsProps {
  companyId?: string;
  sectorId?: string;
  timeRange?: 'month' | 'quarter' | 'year';
}

export function PredictiveReports({ companyId, sectorId, timeRange = 'quarter' }: PredictiveReportsProps) {
  // Simular dados preditivos baseados em análise histórica
  const { data: predictiveData, isLoading } = useQuery({
    queryKey: ['predictive-reports', companyId, sectorId, timeRange],
    queryFn: async () => {
      // Simulação de análise preditiva
      const baseData = {
        skillDemandForecast: [
          { skill: 'React', currentDemand: 85, predictedDemand: 92, trend: 'increasing' },
          { skill: 'TypeScript', currentDemand: 78, predictedDemand: 88, trend: 'increasing' },
          { skill: 'Node.js', currentDemand: 72, predictedDemand: 75, trend: 'stable' },
          { skill: 'Python', currentDemand: 65, predictedDemand: 58, trend: 'decreasing' },
          { skill: 'Docker', currentDemand: 45, predictedDemand: 67, trend: 'increasing' }
        ],
        trainingEffectiveness: {
          avgCompletionRate: 78,
          avgSkillImprovement: 23,
          timeToCompetency: 45, // dias
          retentionRate: 85
        },
        gapTrends: {
          criticalGaps: { current: 12, predicted: 8, change: -33 },
          mediumGaps: { current: 25, predicted: 18, change: -28 },
          totalGaps: { current: 45, predicted: 32, change: -29 }
        },
        investmentRecommendations: [
          {
            area: 'Desenvolvimento Front-end',
            priority: 'high',
            estimatedCost: 15000,
            expectedROI: '250%',
            timeline: '3 meses'
          },
          {
            area: 'DevOps e Infraestrutura',
            priority: 'medium',
            estimatedCost: 12000,
            expectedROI: '180%',
            timeline: '4 meses'
          }
        ]
      };

      return baseData;
    },
    enabled: !!companyId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Gerando Relatórios Preditivos...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!predictiveData) {
    return null;
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Previsão de Demanda por Competências */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Previsão de Demanda por Competências
            <Badge variant="outline">Próximos {timeRange === 'month' ? '30 dias' : timeRange === 'quarter' ? '3 meses' : '12 meses'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveData.skillDemandForecast.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className={getTrendColor(skill.trend)}>
                      {getTrendIcon(skill.trend)} {skill.predictedDemand - skill.currentDemand > 0 ? '+' : ''}{skill.predictedDemand - skill.currentDemand}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Atual: {skill.currentDemand}%</span>
                    <span>Previsto: {skill.predictedDemand}%</span>
                  </div>
                  <Progress value={skill.predictedDemand} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Efetividade de Treinamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Análise de Efetividade de Treinamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {predictiveData.trainingEffectiveness.avgCompletionRate}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +{predictiveData.trainingEffectiveness.avgSkillImprovement}%
              </div>
              <div className="text-sm text-muted-foreground">Melhoria Média</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {predictiveData.trainingEffectiveness.timeToCompetency}
              </div>
              <div className="text-sm text-muted-foreground">Dias para Competência</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {predictiveData.trainingEffectiveness.retentionRate}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Retenção</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendências de Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Projeção de Redução de Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(predictiveData.gapTrends).map(([key, data]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {data.current} → {data.predicted}
                  </span>
                  <Badge variant={data.change < 0 ? "default" : "secondary"}>
                    {data.change > 0 ? '+' : ''}{data.change}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações de Investimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recomendações de Investimento em Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveData.investmentRecommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{rec.area}</h4>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                    {rec.priority}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Investimento:</span>
                    <div className="font-medium">R$ {rec.estimatedCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ROI Estimado:</span>
                    <div className="font-medium text-green-600">{rec.expectedROI}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prazo:</span>
                    <div className="font-medium">{rec.timeline}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
        <Button variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Atualizações
        </Button>
      </div>
    </div>
  );
}
