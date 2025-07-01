
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface RiskTrendChartProps {
  data: any[];
  isLoading?: boolean;
}

export function RiskTrendChart({ data, isLoading }: RiskTrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Riscos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  const formatXAxisDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tendência de Riscos (Últimos 90 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisDate}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `Data: ${new Date(value).toLocaleDateString()}`}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === 'high_risk_percentage' ? 'Risco Alto' :
                  name === 'critical_risk_percentage' ? 'Risco Crítico' :
                  name === 'avg_score' ? 'Score Médio' : name
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="high_risk_percentage" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Risco Alto (%)"
              />
              <Line 
                type="monotone" 
                dataKey="critical_risk_percentage" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Risco Crítico (%)"
              />
              <Line 
                type="monotone" 
                dataKey="avg_score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Score Médio"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Dados insuficientes para gerar gráfico de tendência
          </div>
        )}
      </CardContent>
    </Card>
  );
}
