
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";

interface PerformanceMetricsProps {
  companyId?: string;
}

export function PerformanceMetrics({ companyId }: PerformanceMetricsProps) {
  const { stats, isLoading } = usePsychosocialAutomation(companyId);

  // Dados simulados de performance histórica
  const performanceData = React.useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        tempo_resposta: Math.floor(Math.random() * 20) + 10,
        throughput: Math.floor(Math.random() * 50) + 20,
        cpu_usage: Math.floor(Math.random() * 30) + 15,
        memoria_usage: Math.floor(Math.random() * 40) + 30,
        sucessos: Math.floor(Math.random() * 45) + 35,
        falhas: Math.floor(Math.random() * 5)
      };
    });
  }, []);

  const chartConfig = {
    tempo_resposta: {
      label: "Tempo de Resposta (s)",
      color: "#3b82f6"
    },
    throughput: {
      label: "Throughput (req/h)",
      color: "#10b981"
    },
    cpu_usage: {
      label: "CPU (%)",
      color: "#f59e0b"
    },
    memoria_usage: {
      label: "Memória (%)",
      color: "#8b5cf6"
    },
    sucessos: {
      label: "Sucessos",
      color: "#10b981"
    },
    falhas: {
      label: "Falhas",
      color: "#ef4444"
    }
  };

  // Calcular métricas de performance
  const averageResponseTime = React.useMemo(() => {
    return stats?.avg_processing_time_seconds || 0;
  }, [stats]);

  const successRate = React.useMemo(() => {
    if (!stats || stats.total_processed === 0) return 100;
    return Math.round((stats.successful_processed / stats.total_processed) * 100);
  }, [stats]);

  const systemHealth = React.useMemo(() => {
    if (successRate >= 98) return { status: "excellent", color: "green", label: "Excelente" };
    if (successRate >= 95) return { status: "good", color: "blue", label: "Bom" };
    if (successRate >= 90) return { status: "fair", color: "yellow", label: "Regular" };
    return { status: "poor", color: "red", label: "Crítico" };
  }, [successRate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Métricas de Performance</h3>
      </div>

      {/* KPIs principais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {averageResponseTime > 0 ? `${Math.round(averageResponseTime)}s` : "N/A"}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {averageResponseTime < 30 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Ótimo</span>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <Progress value={successRate} className="mt-2" />
            <Badge 
              variant={systemHealth.status === "excellent" ? "default" : "secondary"}
              className="mt-2 text-xs"
            >
              {systemHealth.label}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.total_processed || 0}/dia
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Processamentos por dia
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidade</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Uptime do sistema
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resposta (24h)</CardTitle>
            <CardDescription>
              Tempo médio de processamento por hora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="tempo_resposta" 
                    stroke={chartConfig.tempo_resposta.color}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput (24h)</CardTitle>
            <CardDescription>
              Processamentos realizados por hora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="throughput" 
                    stroke={chartConfig.throughput.color}
                    fill={chartConfig.throughput.color}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos do Sistema</CardTitle>
          <CardDescription>
            Utilização de CPU e memória nas últimas 24 horas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="cpu_usage" 
                  stroke={chartConfig.cpu_usage.color}
                  strokeWidth={2}
                  name="CPU (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="memoria_usage" 
                  stroke={chartConfig.memoria_usage.color}
                  strokeWidth={2}
                  name="Memória (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
