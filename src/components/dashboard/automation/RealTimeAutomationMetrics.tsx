
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";

interface RealTimeAutomationMetricsProps {
  companyId?: string;
}

export function RealTimeAutomationMetrics({ companyId }: RealTimeAutomationMetricsProps) {
  const { stats, isLoading } = usePsychosocialAutomation(companyId);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const successRate = stats 
    ? Math.round((stats.successful_processed / Math.max(stats.total_processed, 1)) * 100)
    : 0;

  const avgProcessingTime = stats?.avg_processing_time_seconds || 0;
  const formattedTime = avgProcessingTime > 0 ? `${Math.round(avgProcessingTime)}s` : "N/A";

  const criticalRate = stats
    ? Math.round((stats.critical_risk_found / Math.max(stats.total_processed, 1)) * 100)
    : 0;

  const highRiskRate = stats
    ? Math.round((stats.high_risk_found / Math.max(stats.total_processed, 1)) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Header com última atualização */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Métricas em Tempo Real</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Atualizado: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Taxa de Sucesso */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.successful_processed || 0} de {stats?.total_processed || 0}
            </div>
            <Progress value={successRate} className="mt-3" />
            {successRate >= 95 && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  Excelente
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tempo Médio de Processamento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formattedTime}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Por processamento
            </div>
            <div className="flex items-center gap-1 mt-2">
              {avgProcessingTime < 30 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Rápido</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 text-yellow-600" />
                  <span className="text-xs text-yellow-600">Normal</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Riscos Críticos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riscos Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.critical_risk_found || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {criticalRate}% do total
            </div>
            {criticalRate > 0 && (
              <Badge variant="destructive" className="mt-2 text-xs">
                Ação Imediata
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Planos de Ação Gerados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Gerados</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.action_plans_generated || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Planos de ação automáticos
            </div>
            {(stats?.action_plans_generated || 0) > 0 && (
              <Badge variant="secondary" className="mt-2 text-xs">
                Automação Ativa
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Indicadores secundários */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Riscos Altos</p>
                <p className="text-lg font-semibold text-orange-600">{stats?.high_risk_found || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{highRiskRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notificações Enviadas</p>
                <p className="text-lg font-semibold">{stats?.notifications_sent || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processamentos Falharam</p>
                <p className="text-lg font-semibold text-red-600">{stats?.failed_processed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
