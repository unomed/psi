
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import type { DashboardMetric } from "@/services/analytics/dashboardAnalyticsService";

interface AdvancedMetricsCardProps {
  metrics: DashboardMetric[];
  isLoading?: boolean;
}

export function AdvancedMetricsCard({ metrics, isLoading }: AdvancedMetricsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas Principais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando métricas...</div>
        </CardContent>
      </Card>
    );
  }

  const formatMetricValue = (value: number, unit: string) => {
    switch (unit) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'count':
        return Math.round(value).toString();
      case 'minutes':
        return `${value.toFixed(1)}min`;
      case 'days':
        return `${value.toFixed(0)} dias`;
      default:
        return value.toFixed(2);
    }
  };

  const getMetricIcon = (metricName: string, value: number) => {
    if (metricName.includes('risk') || metricName.includes('critical')) {
      if (value > 20) return <AlertTriangle className="h-4 w-4 text-red-500" />;
      if (value > 10) return <TrendingUp className="h-4 w-4 text-orange-500" />;
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    
    if (metricName.includes('compliance')) {
      if (value > 80) return <TrendingUp className="h-4 w-4 text-green-500" />;
      if (value > 60) return <Minus className="h-4 w-4 text-orange-500" />;
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }

    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getMetricColor = (metricName: string, value: number) => {
    if (metricName.includes('risk') || metricName.includes('critical')) {
      if (value > 20) return 'destructive';
      if (value > 10) return 'secondary';
      return 'default';
    }
    
    if (metricName.includes('compliance')) {
      if (value > 80) return 'default';
      if (value > 60) return 'secondary';
      return 'destructive';
    }

    return 'default';
  };

  const getProgressValue = (metricName: string, value: number) => {
    if (metricName.includes('percentage')) {
      return Math.min(value, 100);
    }
    if (metricName.includes('compliance')) {
      return value;
    }
    // For other metrics, normalize to 0-100 scale
    return Math.min((value / 100) * 100, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Métricas Principais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getMetricIcon(metric.metric_name, metric.metric_value)}
                  <span className="text-sm font-medium capitalize">
                    {metric.metric_name.replace(/_/g, ' ')}
                  </span>
                </div>
                <Badge variant={getMetricColor(metric.metric_name, metric.metric_value) as any}>
                  {formatMetricValue(metric.metric_value, metric.metric_unit)}
                </Badge>
              </div>
              
              {metric.metric_unit === 'percentage' && (
                <Progress 
                  value={getProgressValue(metric.metric_name, metric.metric_value)} 
                  className="h-2"
                />
              )}

              <div className="text-xs text-muted-foreground">
                Atualizado em {new Date(metric.calculation_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {metrics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma métrica disponível ainda
          </div>
        )}
      </CardContent>
    </Card>
  );
}
