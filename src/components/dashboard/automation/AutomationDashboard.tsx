
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, TrendingUp, Bot } from "lucide-react";
import { RealTimeAutomationMetrics } from "./RealTimeAutomationMetrics";
import { ProcessingTrendsChart } from "./ProcessingTrendsChart";
import { RiskDistributionChart } from "./RiskDistributionChart";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { AutomationActivityFeed } from "./AutomationActivityFeed";

interface AutomationDashboardProps {
  companyId?: string;
}

export function AutomationDashboard({ companyId }: AutomationDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Automação</h2>
          <p className="text-muted-foreground">
            Monitoramento em tempo real do sistema de processamento automático
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Sistema Ativo</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Atividade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <RealTimeAutomationMetrics companyId={companyId} />
            <div className="grid gap-6 md:grid-cols-2">
              <RiskDistributionChart companyId={companyId} />
              <Card>
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                  <CardDescription>
                    Indicadores de saúde do sistema de automação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Processamento Ativo</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium">Operacional</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fila de Processamento</span>
                      <span className="text-sm font-medium">0 itens</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Última Verificação</span>
                      <span className="text-sm font-medium">Agora</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <ProcessingTrendsChart companyId={companyId} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMetrics companyId={companyId} />
        </TabsContent>

        <TabsContent value="activity">
          <AutomationActivityFeed companyId={companyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
