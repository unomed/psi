
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Calendar, AlertTriangle } from "lucide-react";

interface ProcessingTrendsChartProps {
  companyId?: string;
}

export function ProcessingTrendsChart({ companyId }: ProcessingTrendsChartProps) {
  const { data: trendsData, isLoading } = useQuery({
    queryKey: ['processingTrends', companyId],
    queryFn: async () => {
      // Simular dados de tendência por enquanto - depois pode ser substituído por dados reais
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        
        return {
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          processamentos: Math.floor(Math.random() * 15) + 5,
          sucessos: Math.floor(Math.random() * 12) + 8,
          falhas: Math.floor(Math.random() * 3),
          riscos_criticos: Math.floor(Math.random() * 2),
          riscos_altos: Math.floor(Math.random() * 5) + 1,
          tempo_medio: Math.floor(Math.random() * 20) + 15
        };
      });
      
      return last30Days;
    },
    refetchInterval: 60000 // Atualizar a cada minuto
  });

  const chartConfig = {
    processamentos: {
      label: "Processamentos",
      color: "#3b82f6"
    },
    sucessos: {
      label: "Sucessos",
      color: "#10b981"
    },
    falhas: {
      label: "Falhas",
      color: "#ef4444"
    },
    riscos_criticos: {
      label: "Riscos Críticos",
      color: "#dc2626"
    },
    riscos_altos: {
      label: "Riscos Altos", 
      color: "#f59e0b"
    },
    tempo_medio: {
      label: "Tempo Médio (s)",
      color: "#8b5cf6"
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Tendências de Processamento (30 dias)</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Volume de Processamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Volume de Processamento
            </CardTitle>
            <CardDescription>
              Processamentos realizados por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="processamentos" 
                    stroke={chartConfig.processamentos.color}
                    fill={chartConfig.processamentos.color}
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sucessos" 
                    stroke={chartConfig.sucessos.color}
                    fill={chartConfig.sucessos.color}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Detecção de Riscos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Detecção de Riscos
            </CardTitle>
            <CardDescription>
              Riscos identificados por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day"
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="riscos_criticos" 
                    fill={chartConfig.riscos_criticos.color}
                    name="Críticos"
                  />
                  <Bar 
                    dataKey="riscos_altos" 
                    fill={chartConfig.riscos_altos.color}
                    name="Altos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance do Sistema</CardTitle>
          <CardDescription>
            Tempo médio de processamento e taxa de sucesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day"
                  tickFormatter={(value) => `Dia ${value}`}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="tempo_medio" 
                  stroke={chartConfig.tempo_medio.color}
                  strokeWidth={2}
                  name="Tempo Médio (s)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sucessos" 
                  stroke={chartConfig.sucessos.color}
                  strokeWidth={2}
                  name="Sucessos"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
