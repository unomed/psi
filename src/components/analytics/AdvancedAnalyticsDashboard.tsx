
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, TrendingUp, Target, RefreshCw } from "lucide-react";
import { useDashboardAnalytics } from "@/hooks/analytics/useDashboardAnalytics";
import { AdvancedMetricsCard } from "./AdvancedMetricsCard";
import { RiskTrendChart } from "./RiskTrendChart";
import { SectorBenchmarkChart } from "./SectorBenchmarkChart";
import { ActionEffectivenessChart } from "./ActionEffectivenessChart";

interface AdvancedAnalyticsDashboardProps {
  companyId?: string;
}

export function AdvancedAnalyticsDashboard({ companyId }: AdvancedAnalyticsDashboardProps) {
  const [periodDays, setPeriodDays] = useState(30);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  
  const { 
    analytics, 
    metrics, 
    riskTrend, 
    isLoading, 
    refetch 
  } = useDashboardAnalytics(companyId, periodDays);

  const industries = [
    'Manufatura',
    'Serviços', 
    'Tecnologia',
    'Saúde',
    'Educação',
    'Construção',
    'Transporte'
  ];

  const periodOptions = [
    { value: 7, label: 'Última semana' },
    { value: 30, label: 'Último mês' },
    { value: 90, label: 'Últimos 3 meses' },
    { value: 180, label: 'Últimos 6 meses' },
    { value: 365, label: 'Último ano' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avançado</h2>
          <p className="text-muted-foreground">
            Análises detalhadas e métricas de performance do sistema de riscos psicossociais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={periodDays.toString()} 
            onValueChange={(value) => setPeriodDays(Number(value))}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Benchmarks
          </TabsTrigger>
          <TabsTrigger value="effectiveness" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Efetividade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdvancedMetricsCard metrics={metrics || []} isLoading={isLoading} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <RiskTrendChart data={riskTrend || []} isLoading={isLoading} />
            <ActionEffectivenessChart 
              data={analytics?.action_effectiveness || []} 
              isLoading={isLoading} 
            />
          </div>

          {analytics?.sector_breakdown && analytics.sector_breakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Breakdown por Setor</CardTitle>
                <CardDescription>
                  Distribuição de riscos por setor da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.sector_breakdown.map((sector, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">{sector.sector_name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total de Análises:</span>
                          <span className="font-medium">{sector.total_analyses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Riscos Altos:</span>
                          <span className="text-orange-600 font-medium">{sector.high_risk_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Riscos Críticos:</span>
                          <span className="text-red-600 font-medium">{sector.critical_risk_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <RiskTrendChart data={riskTrend || []} isLoading={isLoading} />
          
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
              <CardDescription>
                Insights sobre a evolução dos riscos ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {riskTrend && riskTrend.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {riskTrend[riskTrend.length - 1]?.avg_score?.toFixed(1) || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Score Médio Atual</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {riskTrend.reduce((sum, day) => sum + (day.high_risk || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Riscos Altos</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {riskTrend.reduce((sum, day) => sum + (day.critical_risk || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Riscos Críticos</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Dados insuficientes para análise de tendências
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SectorBenchmarkChart industrySector={selectedIndustry || undefined} />
        </TabsContent>

        <TabsContent value="effectiveness" className="space-y-6">
          <ActionEffectivenessChart 
            data={analytics?.action_effectiveness || []} 
            isLoading={isLoading} 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhes de Efetividade</CardTitle>
              <CardDescription>
                Análise detalhada da implementação dos planos de ação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.action_effectiveness && analytics.action_effectiveness.length > 0 ? (
                <div className="space-y-4">
                  {analytics.action_effectiveness.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium capitalize">Planos de Risco {item.risk_level}</h3>
                        <div className="text-2xl font-bold">
                          {item.completion_rate.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total de Planos:</span>
                          <div className="font-medium">{item.total_plans}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Planos Concluídos:</span>
                          <div className="font-medium text-green-600">{item.completed_plans}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum dado de efetividade disponível
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
