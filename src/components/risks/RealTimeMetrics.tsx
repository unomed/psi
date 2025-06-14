
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { RiskErrorBoundary } from "./error-boundary/RiskErrorBoundary";
import { useOptimizedQueries } from "@/hooks/useOptimizedQueries";

interface RealTimeMetricsProps {
  companyId?: string;
  refreshInterval?: number;
}

export function RealTimeMetrics({ companyId, refreshInterval = 30000 }: RealTimeMetricsProps) {
  const { stats, isLoading } = usePsychosocialAutomation(companyId);
  const { prefetchQuery } = useOptimizedQueries();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh das métricas
  useEffect(() => {
    const interval = setInterval(() => {
      prefetchQuery(
        ['psychosocialProcessingStats', companyId],
        () => Promise.resolve(stats)
      );
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [companyId, refreshInterval, prefetchQuery, stats]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSkeleton lines={3} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const successRate = stats 
    ? Math.round((stats.successful_processed / Math.max(stats.total_processed, 1)) * 100)
    : 0;

  const criticalRiskRate = stats
    ? Math.round((stats.critical_risk_found / Math.max(stats.total_processed, 1)) * 100)
    : 0;

  return (
    <RiskErrorBoundary>
      <div className="space-y-4">
        {/* Header com informações de atualização */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Métricas em Tempo Real</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Taxa de Sucesso */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{successRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats?.successful_processed || 0} de {stats?.total_processed || 0} processamentos
              </div>
              <Progress value={successRate} className="mt-2" />
            </CardContent>
          </Card>

          {/* Processamentos Totais */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Processado</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_processed || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Avaliações processadas
              </div>
              {stats && stats.failed_processed > 0 && (
                <Badge variant="destructive" className="mt-2 text-xs">
                  {stats.failed_processed} falhas
                </Badge>
              )}
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
                {criticalRiskRate}% do total
              </div>
              {criticalRiskRate > 0 && (
                <Progress value={criticalRiskRate} className="mt-2" />
              )}
            </CardContent>
          </Card>

          {/* Riscos Altos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riscos Altos</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats?.high_risk_found || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Requer atenção
              </div>
              {(stats?.high_risk_found || 0) > 0 && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Monitorar
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status geral */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">Sistema operacional</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Processamento automático ativo
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RiskErrorBoundary>
  );
}
