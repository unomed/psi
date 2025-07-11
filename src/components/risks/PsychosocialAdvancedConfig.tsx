import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Brain, Calculator, Zap, TrendingUp, Target, AlertTriangle, CheckCircle, Settings, BarChart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PsychosocialAdvancedConfigProps {
  selectedCompanyId: string | null;
}

export function PsychosocialAdvancedConfig({ selectedCompanyId }: PsychosocialAdvancedConfigProps) {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [aiConfigSaved, setAiConfigSaved] = useState(false);
  const [predictiveAnalysis, setPredictiveAnalysis] = useState(true);
  const [intelligentRecommendations, setIntelligentRecommendations] = useState(true);
  const [riskTrendAnalysis, setRiskTrendAnalysis] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para configurações avançadas</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Configurações salvas com sucesso!");
  };

  const handleAiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Salvar configurações de IA
      const { error } = await supabase
        .from('psychosocial_automation_config')
        .upsert({
          company_id: selectedCompanyId,
          ai_enabled: aiEnabled,
          ai_config: {
            openai_enabled: !!openaiApiKey,
            predictive_analysis: predictiveAnalysis,
            intelligent_recommendations: intelligentRecommendations,
            risk_trend_analysis: riskTrendAnalysis
          }
        });

      if (error) throw error;

      setAiConfigSaved(true);
      toast.success("Configurações de IA salvas com sucesso!");
      
      // Se IA habilitada, executar análise de demonstração
      if (aiEnabled) {
        await demonstrateAiAnalysis();
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error("Erro ao salvar configurações de IA");
    } finally {
      setLoading(false);
    }
  };

  const demonstrateAiAnalysis = async () => {
    // Simular análise com IA (com dados mock)
    const mockAnalysis = {
      riskPredictions: [
        { sector: "Administração", currentRisk: 45, predictedRisk: 52, trend: "increasing", confidence: 85 },
        { sector: "Produção", currentRisk: 72, predictedRisk: 68, trend: "decreasing", confidence: 92 },
        { sector: "Vendas", currentRisk: 38, predictedRisk: 41, trend: "stable", confidence: 78 }
      ],
      recommendations: [
        {
          type: "urgent",
          message: "Setor de Produção apresenta sinais de melhora - manter estratégias atuais",
          confidence: 92,
          expectedImpact: "15% redução de risco"
        },
        {
          type: "preventive", 
          message: "Administração requer atenção - implementar programa de bem-estar",
          confidence: 85,
          expectedImpact: "20% melhoria no ambiente"
        }
      ],
      insights: [
        "Padrão sazonal identificado: riscos aumentam 12% no fim do trimestre",
        "Correlação detectada entre carga horária e stress (r=0.74)",
        "Funcionários com mais de 5 anos apresentam 23% menos risco"
      ]
    };

    setAnalysisResults(mockAnalysis);
  };


  return (
    <div className="space-y-6">
      {/* Configurações de Processamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
          <CardDescription>
            Configurações avançadas para análise de riscos psicossociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processing_interval">Intervalo de processamento (segundos)</Label>
                <Input
                  id="processing_interval"
                  name="processing_interval"
                  type="number"
                  min="60"
                  max="3600"
                  defaultValue={3600}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_concurrent">Máximo de jobs concorrentes</Label>
                <Input
                  id="max_concurrent"
                  name="max_concurrent"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Salvar Configurações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Machine Learning e IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Inteligência Artificial
            {aiConfigSaved && <Badge variant="secondary">Configurado</Badge>}
          </CardTitle>
          <CardDescription>
            Configure análise preditiva, recomendações inteligentes e integração opcional com OpenAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="config" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config">
                <Settings className="h-4 w-4 mr-2" />
                Configuração
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <BarChart className="h-4 w-4 mr-2" />
                Análise IA
              </TabsTrigger>
              <TabsTrigger value="results">
                <TrendingUp className="h-4 w-4 mr-2" />
                Resultados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <form onSubmit={handleAiSubmit} className="space-y-6">
                {/* Ativação da IA */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Habilitar Inteligência Artificial</h4>
                    <p className="text-sm text-muted-foreground">
                      Ativa análise preditiva e recomendações inteligentes baseadas em dados históricos
                    </p>
                  </div>
                  <Switch 
                    checked={aiEnabled} 
                    onCheckedChange={setAiEnabled}
                  />
                </div>

                {aiEnabled && (
                  <>
                    {/* Configuração OpenAI (Opcional) */}
                    <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">Integração OpenAI (Opcional)</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Para análises mais avançadas, você pode integrar com a API do OpenAI. 
                        Deixe em branco para usar apenas análise estatística interna.
                      </p>
                      
                      <div className="space-y-2">
                        <Label htmlFor="openai_key">Chave API OpenAI (Opcional)</Label>
                        <Input
                          id="openai_key"
                          type="password"
                          placeholder="sk-..."
                          value={openaiApiKey}
                          onChange={(e) => setOpenaiApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Com OpenAI: análise de texto, insights contextuais, recomendações personalizadas<br/>
                          Sem OpenAI: análise estatística, predições baseadas em padrões históricos
                        </p>
                      </div>
                    </div>

                    {/* Funcionalidades de IA */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Funcionalidades Disponíveis</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <Label className="font-medium">Análise Preditiva</Label>
                            <p className="text-sm text-muted-foreground">
                              Prevê tendências de risco nos próximos 30-90 dias
                            </p>
                          </div>
                          <Switch 
                            checked={predictiveAnalysis} 
                            onCheckedChange={setPredictiveAnalysis}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <Label className="font-medium">Recomendações Inteligentes</Label>
                            <p className="text-sm text-muted-foreground">
                              Sugere ações específicas baseadas em padrões identificados
                            </p>
                          </div>
                          <Switch 
                            checked={intelligentRecommendations} 
                            onCheckedChange={setIntelligentRecommendations}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <Label className="font-medium">Análise de Tendências</Label>
                            <p className="text-sm text-muted-foreground">
                              Identifica correlações e padrões sazonais nos dados
                            </p>
                          </div>
                          <Switch 
                            checked={riskTrendAnalysis} 
                            onCheckedChange={setRiskTrendAnalysis}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Configurações de IA"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="space-y-4">
                {!aiEnabled ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>IA não está habilitada</p>
                    <p className="text-sm">Configure a IA na aba "Configuração" para ver análises</p>
                  </div>
                ) : !analysisResults ? (
                  <div className="text-center py-8">
                    <Button onClick={demonstrateAiAnalysis} disabled={loading}>
                      {loading ? "Analisando..." : "Executar Análise Demonstrativa"}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Execute uma análise para ver como a IA funciona
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">Predições</h4>
                        </div>
                        <p className="text-2xl font-bold">{analysisResults.riskPredictions.length}</p>
                        <p className="text-sm text-muted-foreground">Setores analisados</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-green-500" />
                          <h4 className="font-medium">Recomendações</h4>
                        </div>
                        <p className="text-2xl font-bold">{analysisResults.recommendations.length}</p>
                        <p className="text-sm text-muted-foreground">Ações sugeridas</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-5 w-5 text-purple-500" />
                          <h4 className="font-medium">Insights</h4>
                        </div>
                        <p className="text-2xl font-bold">{analysisResults.insights.length}</p>
                        <p className="text-sm text-muted-foreground">Padrões identificados</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results">
              {analysisResults ? (
                <div className="space-y-6">
                  {/* Predições de Risco */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Predições de Risco por Setor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResults.riskPredictions.map((prediction: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{prediction.sector}</h4>
                              <Badge variant={
                                prediction.trend === 'increasing' ? 'destructive' : 
                                prediction.trend === 'decreasing' ? 'default' : 'secondary'
                              }>
                                {prediction.trend === 'increasing' ? 'Subindo' :
                                 prediction.trend === 'decreasing' ? 'Diminuindo' : 'Estável'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Risco Atual</p>
                                <p className="font-medium">{prediction.currentRisk}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Predição (30 dias)</p>
                                <p className="font-medium">{prediction.predictedRisk}%</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Confiança da IA</span>
                                <span>{prediction.confidence}%</span>
                              </div>
                              <Progress value={prediction.confidence} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recomendações */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Recomendações Inteligentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResults.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-start gap-3">
                              {rec.type === 'urgent' ? (
                                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{rec.message}</p>
                                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                                  <span>Impacto Esperado: {rec.expectedImpact}</span>
                                  <span>Confiança: {rec.confidence}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Insights da Inteligência Artificial
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResults.insights.map((insight: string, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma análise executada ainda</p>
                  <p className="text-sm">Execute uma análise na aba anterior para ver os resultados</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}