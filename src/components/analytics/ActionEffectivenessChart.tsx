
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { DashboardAnalytics } from "@/services/analytics/dashboardAnalyticsService";

interface ActionEffectivenessChartProps {
  data: DashboardAnalytics['action_effectiveness'];
  isLoading?: boolean;
}

export function ActionEffectivenessChart({ data, isLoading }: ActionEffectivenessChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Efetividade dos Planos de Ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  const COLORS = {
    'baixo': '#10b981',
    'medio': '#f59e0b', 
    'alto': '#ef4444',
    'critico': '#7c2d12'
  };

  const pieData = data.map(item => ({
    name: `Risco ${item.risk_level}`,
    value: item.completion_rate,
    total_plans: item.total_plans,
    completed_plans: item.completed_plans,
    risk_level: item.risk_level
  }));

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow">
          <p className="font-medium">{data.name}</p>
          <p>Taxa de Conclusão: {data.value.toFixed(1)}%</p>
          <p>Planos Concluídos: {data.completed_plans}/{data.total_plans}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Efetividade dos Planos de Ação
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.risk_level as keyof typeof COLORS] || '#6b7280'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-4">
              {data.map(item => (
                <div key={item.risk_level} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">Risco {item.risk_level}</span>
                    <Badge 
                      style={{ 
                        backgroundColor: COLORS[item.risk_level as keyof typeof COLORS] || '#6b7280',
                        color: 'white'
                      }}
                    >
                      {item.completion_rate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.completed_plans} de {item.total_plans} planos concluídos
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado de efetividade disponível ainda
          </div>
        )}
      </CardContent>
    </Card>
  );
}
