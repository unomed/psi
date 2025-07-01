
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";
import { AlertTriangle, BarChart3 } from "lucide-react";

interface RiskDistributionChartProps {
  companyId?: string;
}

export function RiskDistributionChart({ companyId }: RiskDistributionChartProps) {
  const { stats, isLoading } = usePsychosocialAutomation(companyId);

  // Preparar dados para os gráficos
  const riskDistributionData = React.useMemo(() => {
    if (!stats) return [];

    const total = stats.total_processed || 1;
    const critical = stats.critical_risk_found || 0;
    const high = stats.high_risk_found || 0;
    const normal = total - critical - high;

    return [
      { name: "Normal", value: normal, color: "#10b981", percentage: ((normal / total) * 100).toFixed(1) },
      { name: "Alto", value: high, color: "#f59e0b", percentage: ((high / total) * 100).toFixed(1) },
      { name: "Crítico", value: critical, color: "#ef4444", percentage: ((critical / total) * 100).toFixed(1) }
    ].filter(item => item.value > 0);
  }, [stats]);

  const categoryData = React.useMemo(() => {
    // Dados simulados por categoria - pode ser substituído por dados reais
    return [
      { category: "Org. Trabalho", criticos: 3, altos: 8, normais: 25 },
      { category: "Cond. Ambientais", criticos: 1, altos: 5, normais: 30 },
      { category: "Relações Sociais", criticos: 2, altos: 6, normais: 28 },
      { category: "Reconhecimento", criticos: 4, altos: 9, normais: 23 },
      { category: "Vida Social", criticos: 1, altos: 4, normais: 31 }
    ];
  }, []);

  const chartConfig = {
    criticos: {
      label: "Críticos",
      color: "#ef4444"
    },
    altos: {
      label: "Altos",
      color: "#f59e0b"
    },
    normais: {
      label: "Normais",
      color: "#10b981"
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Pizza - Distribuição Geral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Distribuição de Riscos
            </CardTitle>
            <CardDescription>
              Proporção de riscos identificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Quantidade: {data.value}</p>
                            <p className="text-sm">Porcentagem: {data.percentage}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Riscos por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição por categoria psicossocial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    width={100}
                    tickFormatter={(value) => value.split(' ').slice(0, 2).join(' ')}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="criticos" 
                    stackId="risk"
                    fill={chartConfig.criticos.color}
                    name="Críticos"
                  />
                  <Bar 
                    dataKey="altos" 
                    stackId="risk"
                    fill={chartConfig.altos.color}
                    name="Altos"
                  />
                  <Bar 
                    dataKey="normais" 
                    stackId="risk"
                    fill={chartConfig.normais.color}
                    name="Normais"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats?.critical_risk_found || 0}
              </div>
              <div className="text-sm text-muted-foreground">Riscos Críticos</div>
              <div className="text-xs text-red-600 mt-1">
                Requer ação imediata
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats?.high_risk_found || 0}
              </div>
              <div className="text-sm text-muted-foreground">Riscos Altos</div>
              <div className="text-xs text-orange-600 mt-1">
                Monitoramento próximo
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(stats?.total_processed || 0) - (stats?.critical_risk_found || 0) - (stats?.high_risk_found || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Baixo Risco</div>
              <div className="text-xs text-green-600 mt-1">
                Situação normal
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
