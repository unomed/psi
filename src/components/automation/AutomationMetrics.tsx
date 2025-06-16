
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react";

interface AutomationMetricsProps {
  companyId?: string;
}

export function AutomationMetrics({ companyId }: AutomationMetricsProps) {
  // Mock data - seria substituído por dados reais
  const metrics = {
    totalRules: 8,
    activeRules: 6,
    executionsToday: 24,
    successRate: 95.2,
    avgExecutionTime: 1.8,
    notificationsSent: 156
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Métricas de Automação</h3>
        <p className="text-sm text-muted-foreground">
          Acompanhe a performance e efetividade das automações
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.totalRules}</div>
                <div className="text-sm text-muted-foreground">Regras Totais</div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2 este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.executionsToday}</div>
                <div className="text-sm text-muted-foreground">Execuções Hoje</div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+18% vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.successRate}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+0.8% este mês</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance de Execução</CardTitle>
            <CardDescription>Tempos médios e eficiência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Tempo Médio de Execução</span>
              <span className="font-medium">{metrics.avgExecutionTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Regras Ativas</span>
              <span className="font-medium">{metrics.activeRules}/{metrics.totalRules}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Notificações Enviadas</span>
              <span className="font-medium">{metrics.notificationsSent}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Trigger</CardTitle>
            <CardDescription>Distribuição por evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Avaliação Concluída</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Risco Detectado</span>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Prazo Próximo</span>
                <span className="text-sm text-muted-foreground">25%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Problemas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Status do Sistema
          </CardTitle>
          <CardDescription>Alertas e notificações importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Todas as regras funcionando corretamente</span>
              </div>
              <span className="text-xs text-green-600">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">2 regras com execução lenta</span>
              </div>
              <span className="text-xs text-yellow-600">Atenção</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
