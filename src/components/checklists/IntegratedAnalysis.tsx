
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Users, Heart, Brain, TrendingUp } from "lucide-react";

interface IntegratedAnalysisProps {
  psychosocialResult?: any;
  personalLifeResult?: any;
  evaluation360Results?: any[];
  employeeName: string;
}

export function IntegratedAnalysis({ 
  psychosocialResult, 
  personalLifeResult, 
  evaluation360Results, 
  employeeName 
}: IntegratedAnalysisProps) {
  
  const calculateRiskCorrelation = () => {
    if (!psychosocialResult || !personalLifeResult) return "unknown";
    
    const workRisk = psychosocialResult.riskLevel || "baixo";
    const personalRisk = personalLifeResult.overallRisk || "baixo";
    
    if (workRisk === "alto" || workRisk === "critico") {
      if (personalRisk === "alto" || personalRisk === "critico") {
        return "mixed"; // Problemas tanto no trabalho quanto pessoais
      }
      return "work"; // Problema principalmente no trabalho
    }
    
    if (personalRisk === "alto" || personalRisk === "critico") {
      return "personal"; // Problema principalmente pessoal
    }
    
    return "unknown";
  };

  const correlation = calculateRiskCorrelation();

  const getCorrelationInfo = (correlation: string) => {
    switch (correlation) {
      case "work":
        return {
          label: "Fator Organizacional",
          description: "Os riscos identificados têm origem principalmente no ambiente de trabalho",
          color: "bg-orange-100 text-orange-800",
          icon: <Users className="h-4 w-4" />
        };
      case "personal":
        return {
          label: "Fator Pessoal",
          description: "Os riscos identificados têm origem principalmente em fatores pessoais/familiares",
          color: "bg-blue-100 text-blue-800",
          icon: <Heart className="h-4 w-4" />
        };
      case "mixed":
        return {
          label: "Fatores Múltiplos",
          description: "Os riscos têm origem tanto em fatores organizacionais quanto pessoais",
          color: "bg-purple-100 text-purple-800",
          icon: <Brain className="h-4 w-4" />
        };
      default:
        return {
          label: "Análise Inconclusiva",
          description: "Dados insuficientes para determinar a origem dos riscos",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertTriangle className="h-4 w-4" />
        };
    }
  };

  const correlationInfo = getCorrelationInfo(correlation);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Análise Integrada - {employeeName}</h2>
        <p className="text-muted-foreground">
          Correlação entre fatores psicossociais, pessoais e avaliações 360°
        </p>
      </div>

      {/* Indicador de Correlação Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Origem dos Fatores de Risco
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={correlationInfo.color}>
              {correlationInfo.icon}
              {correlationInfo.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {correlationInfo.description}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resultado Psicossocial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fatores Psicossociais</CardTitle>
            <CardDescription>Avaliação do ambiente de trabalho</CardDescription>
          </CardHeader>
          <CardContent>
            {psychosocialResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Nível de Risco:</span>
                  <Badge variant={psychosocialResult.riskLevel === "alto" ? "destructive" : "secondary"}>
                    {psychosocialResult.riskLevel || "baixo"}
                  </Badge>
                </div>
                <Progress value={psychosocialResult.score || 0} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  Score: {psychosocialResult.score || 0}/100
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                Dados não disponíveis
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultado Vida Pessoal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vida Pessoal/Familiar</CardTitle>
            <CardDescription>Fatores externos ao trabalho</CardDescription>
          </CardHeader>
          <CardContent>
            {personalLifeResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Nível de Impacto:</span>
                  <Badge variant={personalLifeResult.overallRisk === "alto" ? "destructive" : "secondary"}>
                    {personalLifeResult.overallRisk || "baixo"}
                  </Badge>
                </div>
                <Progress value={personalLifeResult.score || 0} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  Score: {personalLifeResult.score || 0}/100
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Heart className="h-8 w-8 mx-auto mb-2" />
                Dados não disponíveis
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultado 360° */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avaliação 360°</CardTitle>
            <CardDescription>Perspectiva dos colegas</CardDescription>
          </CardHeader>
          <CardContent>
            {evaluation360Results && evaluation360Results.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Avaliações:</span>
                  <Badge variant="outline">
                    {evaluation360Results.length} recebidas
                  </Badge>
                </div>
                {evaluation360Results.map((result, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span>{result.category}:</span>
                      <span className="font-medium">{result.average}/5</span>
                    </div>
                    <Progress value={(result.average / 5) * 100} className="w-full h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                Dados não disponíveis
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recomendações baseadas na correlação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recomendações de Intervenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlation === "work" && (
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Foco em melhorias organizacionais (gestão, processos, ambiente)</li>
                <li>Treinamento de liderança e comunicação</li>
                <li>Revisão de carga de trabalho e autonomia</li>
                <li>Implementação de programas de bem-estar no trabalho</li>
              </ul>
            )}
            
            {correlation === "personal" && (
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Oferecer apoio psicológico/aconselhamento</li>
                <li>Programas de auxílio ao funcionário (EAP)</li>
                <li>Flexibilidade de horários para questões pessoais</li>
                <li>Orientação sobre equilíbrio vida-trabalho</li>
              </ul>
            )}
            
            {correlation === "mixed" && (
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Abordagem integrada: suporte pessoal + melhorias organizacionais</li>
                <li>Monitoramento próximo e reavaliação frequente</li>
                <li>Plano de ação multidisciplinar</li>
                <li>Envolvimento de RH, gestão e apoio psicológico</li>
              </ul>
            )}
            
            {correlation === "unknown" && (
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Coletar mais dados através de entrevistas</li>
                <li>Aplicar questionários complementares</li>
                <li>Acompanhamento individual mais próximo</li>
                <li>Reavaliação em 30-60 dias</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
