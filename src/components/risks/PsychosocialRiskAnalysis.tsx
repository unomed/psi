
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, Users, FileText, Plus, Settings } from "lucide-react";
import { usePsychosocialRisk } from "@/hooks/usePsychosocialRisk";
import { getPsychosocialCategories, getExposureLevels } from "@/services/riskManagement/psychosocialRiskService";
import { PsychosocialRiskLoadingState } from "./PsychosocialRiskLoadingState";
import { PsychosocialRiskErrorState } from "./PsychosocialRiskErrorState";
import { PsychosocialRiskConfigForm } from "./PsychosocialRiskConfigForm";

interface PsychosocialRiskAnalysisProps {
  companyId?: string;
}

export function PsychosocialRiskAnalysis({ companyId }: PsychosocialRiskAnalysisProps) {
  const [activeTab, setActiveTab] = useState("analysis");
  const { riskAnalyses, isLoading, generateNR01ActionPlan, error } = usePsychosocialRisk(companyId);
  const categories = getPsychosocialCategories();
  const exposureLevels = getExposureLevels();

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return <PsychosocialRiskErrorState error={error} onRetry={handleRetry} />;
  }

  if (isLoading) {
    return <PsychosocialRiskLoadingState />;
  }

  // Agrupar análises por categoria
  const analysesByCategory = riskAnalyses.reduce((acc: any, analysis: any) => {
    if (!acc[analysis.category]) {
      acc[analysis.category] = [];
    }
    acc[analysis.category].push(analysis);
    return acc;
  }, {});

  const totalAnalyses = riskAnalyses.length;
  const highRiskCount = riskAnalyses.filter(a => a.exposure_level === 'alto' || a.exposure_level === 'critico').length;
  const criticalRiskCount = riskAnalyses.filter(a => a.exposure_level === 'critico').length;

  const handleGenerateActionPlan = async (analysisId: string) => {
    try {
      await generateNR01ActionPlan.mutateAsync(analysisId);
    } catch (error) {
      console.error('Error generating action plan:', error);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full max-w-md">
        <TabsTrigger value="analysis">Análise de Riscos</TabsTrigger>
        <TabsTrigger value="config">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analysis" className="space-y-6">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total de Análises</p>
                  <p className="text-2xl font-bold">{totalAnalyses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Riscos Altos</p>
                  <p className="text-2xl font-bold text-orange-600">{highRiskCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Riscos Críticos</p>
                  <p className="text-2xl font-bold text-red-600">{criticalRiskCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Taxa de Conformidade</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalAnalyses > 0 ? Math.round(((totalAnalyses - criticalRiskCount) / totalAnalyses) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análises por Categoria */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Análises por Categoria NR-01</h3>
          
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const categoryAnalyses = analysesByCategory[categoryKey] || [];
            
            if (categoryAnalyses.length === 0) {
              return (
                <Card key={categoryKey}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base" style={{ color: categoryInfo.color }}>
                          {categoryInfo.label}
                        </CardTitle>
                        <CardDescription>{categoryInfo.description}</CardDescription>
                      </div>
                      <Badge variant="outline">Sem análises</Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            }

            const avgRiskScore = categoryAnalyses.reduce((sum: number, a: any) => sum + a.risk_score, 0) / categoryAnalyses.length;
            const highestExposureLevel = categoryAnalyses.reduce((max: string, a: any) => {
              const levels = ['baixo', 'medio', 'alto', 'critico'];
              return levels.indexOf(a.exposure_level) > levels.indexOf(max) ? a.exposure_level : max;
            }, 'baixo');

            return (
              <Card key={categoryKey}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base" style={{ color: categoryInfo.color }}>
                        {categoryInfo.label}
                      </CardTitle>
                      <CardDescription>{categoryInfo.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        style={{ 
                          backgroundColor: exposureLevels[highestExposureLevel as keyof typeof exposureLevels]?.color,
                          color: 'white'
                        }}
                      >
                        {exposureLevels[highestExposureLevel as keyof typeof exposureLevels]?.label}
                      </Badge>
                      <Badge variant="outline">{categoryAnalyses.length} análises</Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Score Médio de Risco</span>
                      <span className="font-medium">{avgRiskScore.toFixed(1)}%</span>
                    </div>
                    <Progress value={avgRiskScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryAnalyses.slice(0, 4).map((analysis: any) => (
                      <div key={analysis.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm">
                            <p className="font-medium">Score: {analysis.risk_score}%</p>
                            <p className="text-muted-foreground">
                              {analysis.evaluation_date ? new Date(analysis.evaluation_date).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <Badge 
                            style={{ 
                              backgroundColor: exposureLevels[analysis.exposure_level as keyof typeof exposureLevels]?.color,
                              color: 'white'
                            }}
                          >
                            {exposureLevels[analysis.exposure_level as keyof typeof exposureLevels]?.label}
                          </Badge>
                        </div>
                        
                        {(analysis.exposure_level === 'alto' || analysis.exposure_level === 'critico') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateActionPlan(analysis.id)}
                            disabled={generateNR01ActionPlan.isPending}
                            className="w-full"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Gerar Plano NR-01
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {categoryAnalyses.length > 4 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{categoryAnalyses.length - 4} análises adicionais
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        {criticalRiskCount > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Ação Imediata Necessária
              </CardTitle>
              <CardDescription className="text-red-700">
                {criticalRiskCount} análise(s) com nível crítico requerem intervenção imediata conforme NR-01.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => {
                  const criticalAnalyses = riskAnalyses.filter(a => a.exposure_level === 'critico');
                  criticalAnalyses.forEach(analysis => handleGenerateActionPlan(analysis.id));
                }}
                disabled={generateNR01ActionPlan.isPending}
              >
                Gerar Planos de Emergência
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="config">
        <PsychosocialRiskConfigForm selectedCompanyId={companyId} />
      </TabsContent>
    </Tabs>
  );
}
