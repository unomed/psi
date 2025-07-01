
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { PSICOSSOCIAL_CATEGORIES } from "@/services/checklist/templateUtils";

interface PsicossocialResultDisplayProps {
  results: {
    overallRisk: number;
    riskLevel: 'baixo' | 'medio' | 'alto' | 'critico';
    categoryScores: Record<string, number>;
    criticalCategories: string[];
    categoryBreakdown?: Array<{
      category: string;
      score: number;
      riskLevel: string;
    }>;
  };
  employeeName?: string;
}

export function PsicossocialResultDisplay({ results, employeeName }: PsicossocialResultDisplayProps) {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'baixo':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medio':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'alto':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'critico':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'baixo':
        return 'bg-green-500';
      case 'medio':
        return 'bg-yellow-500';
      case 'alto':
        return 'bg-orange-500';
      case 'critico':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'baixo':
        return 'default';
      case 'medio':
        return 'secondary';
      case 'alto':
        return 'destructive';
      case 'critico':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resultado Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon(results.riskLevel)}
            Resultado da Avaliação Psicossocial
            {employeeName && <span className="text-muted-foreground">- {employeeName}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Nível de Risco Geral:</span>
              <Badge variant={getBadgeVariant(results.riskLevel)} className="text-lg px-4 py-1">
                {results.riskLevel.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score Geral</span>
                <span>{results.overallRisk}/100</span>
              </div>
              <Progress 
                value={results.overallRisk} 
                className="h-3"
                style={{
                  background: `linear-gradient(to right, ${getRiskColor(results.riskLevel)} 0%, ${getRiskColor(results.riskLevel)} 100%)`
                }}
              />
            </div>

            {results.criticalCategories.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Categorias Críticas Identificadas:</h4>
                    <ul className="list-disc list-inside text-red-700 mt-1">
                      {results.criticalCategories.map((category, index) => (
                        <li key={index}>{category}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-red-600 mt-2">
                      Recomenda-se ação imediata para essas categorias conforme NR-01.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Categoria - Guia MTE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.categoryBreakdown ? (
              results.categoryBreakdown.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      {getRiskIcon(category.riskLevel)}
                      <Badge variant={getBadgeVariant(category.riskLevel)}>
                        {category.riskLevel}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {category.score}/100
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={category.score} 
                    className="h-2"
                  />
                </div>
              ))
            ) : (
              // Fallback para dados antigos
              Object.entries(results.categoryScores).map(([categoryKey, score]) => {
                const categoryName = PSICOSSOCIAL_CATEGORIES[categoryKey as keyof typeof PSICOSSOCIAL_CATEGORIES] || categoryKey;
                const riskLevel = score >= 80 ? 'critico' : score >= 60 ? 'alto' : score >= 40 ? 'medio' : 'baixo';
                
                return (
                  <div key={categoryKey} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{categoryName}</span>
                      <div className="flex items-center gap-2">
                        {getRiskIcon(riskLevel)}
                        <Badge variant={getBadgeVariant(riskLevel)}>
                          {riskLevel}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {score}/100
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={score} 
                      className="h-2"
                    />
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Baseadas na NR-01</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.riskLevel === 'critico' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Risco Crítico - Ação Imediata Necessária
                </h4>
                <ul className="list-disc list-inside text-red-700 mt-2 text-sm">
                  <li>Implementar medidas de controle imediatas</li>
                  <li>Considerar afastamento temporário se necessário</li>
                  <li>Reavaliação em 30 dias</li>
                  <li>Notificação à gestão e RH</li>
                </ul>
              </div>
            )}
            
            {results.riskLevel === 'alto' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risco Alto - Medidas de Controle Necessárias
                </h4>
                <ul className="list-disc list-inside text-orange-700 mt-2 text-sm">
                  <li>Implementar plano de ação em 30 dias</li>
                  <li>Monitoramento frequente</li>
                  <li>Reavaliação em 90 dias</li>
                  <li>Envolvimento da liderança direta</li>
                </ul>
              </div>
            )}
            
            {results.riskLevel === 'medio' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Risco Médio - Medidas Preventivas
                </h4>
                <ul className="list-disc list-inside text-yellow-700 mt-2 text-sm">
                  <li>Implementar medidas preventivas</li>
                  <li>Monitoramento periódico</li>
                  <li>Reavaliação em 180 dias</li>
                  <li>Acompanhamento pela liderança</li>
                </ul>
              </div>
            )}
            
            {results.riskLevel === 'baixo' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Risco Baixo - Manter Monitoramento
                </h4>
                <ul className="list-disc list-inside text-green-700 mt-2 text-sm">
                  <li>Manter condições atuais</li>
                  <li>Monitoramento de rotina</li>
                  <li>Reavaliação anual</li>
                  <li>Reforço das boas práticas</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
