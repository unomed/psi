
import { ChecklistResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface PsicossocialResultDisplayProps {
  result: ChecklistResult;
}

export function PsicossocialResultDisplay({ result }: PsicossocialResultDisplayProps) {
  const categoryResults = result.categorizedResults || {};
  
  const getRiskLevel = (score: number) => {
    if (score <= 40) return { level: "Baixo", color: "bg-green-500", icon: CheckCircle, variant: "default" as const };
    if (score <= 70) return { level: "Médio", color: "bg-yellow-500", icon: AlertTriangle, variant: "secondary" as const };
    return { level: "Alto", color: "bg-red-500", icon: AlertCircle, variant: "destructive" as const };
  };

  const getRecommendations = (category: string, score: number) => {
    const riskLevel = getRiskLevel(score);
    
    const recommendations: Record<string, Record<string, string[]>> = {
      "Exigências do Trabalho": {
        "Baixo": ["Continue mantendo um bom equilíbrio entre demandas e recursos"],
        "Médio": ["Considere técnicas de gestão de tempo", "Busque suporte quando necessário"],
        "Alto": ["Procure orientação profissional", "Reavalie a carga de trabalho", "Implemente técnicas de redução de estresse"]
      },
      "Controle do Trabalho": {
        "Baixo": ["Busque maior autonomia nas atividades", "Solicite feedback sobre seu desempenho"],
        "Médio": ["Participe de decisões relacionadas ao seu trabalho", "Desenvolva novas competências"],
        "Alto": ["Converse com a liderança sobre maior participação", "Busque oportunidades de desenvolvimento"]
      },
      "Apoio Social": {
        "Baixo": ["Fortaleça relacionamentos com colegas", "Participe de atividades em equipe"],
        "Médio": ["Mantenha comunicação aberta com supervisores", "Busque mentoria"],
        "Alto": ["Considere participar de grupos de apoio", "Melhore a comunicação interpessoal"]
      },
      "Geral": {
        "Baixo": ["Mantenha práticas saudáveis de trabalho"],
        "Médio": ["Busque equilíbrio entre vida pessoal e profissional"],
        "Alto": ["Considere buscar orientação profissional especializada"]
      }
    };

    return recommendations[category]?.[riskLevel.level] || ["Mantenha acompanhamento regular"];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Resultado da Avaliação Psicossocial</CardTitle>
          <p className="text-center text-muted-foreground">
            Concluída em {new Date(result.completedAt).toLocaleDateString()}
          </p>
        </CardHeader>
      </Card>

      {/* Resultados por Categoria */}
      <div className="space-y-4">
        {Object.entries(categoryResults).map(([category, score]) => {
          const risk = getRiskLevel(score);
          const Icon = risk.icon;
          const recommendations = getRecommendations(category, score);

          return (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <Badge variant={risk.variant} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    Risco {risk.level}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pontuação</span>
                    <span>{score}/100</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Recomendações:</h4>
                  <ul className="space-y-1 text-sm">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>Área de maior atenção:</strong> {result.dominantFactor}
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              Recomendamos acompanhamento regular e implementação das orientações específicas para cada categoria.
              Em caso de scores altos de risco, considere buscar orientação profissional especializada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
