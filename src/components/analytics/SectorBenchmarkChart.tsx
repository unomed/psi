
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { useSectorBenchmarks } from "@/hooks/analytics/useDashboardAnalytics";

interface SectorBenchmarkChartProps {
  industrySector?: string;
  companyData?: any[];
}

export function SectorBenchmarkChart({ industrySector, companyData }: SectorBenchmarkChartProps) {
  const { data: benchmarks, isLoading } = useSectorBenchmarks(industrySector);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparação Setorial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando benchmarks...</div>
        </CardContent>
      </Card>
    );
  }

  // Transform benchmark data for chart
  const chartData = benchmarks?.map(benchmark => ({
    category: benchmark.risk_category.replace(/_/g, ' '),
    benchmark: benchmark.benchmark_score,
    percentile_25: benchmark.percentile_25,
    percentile_75: benchmark.percentile_75,
    sample_size: benchmark.sample_size
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Comparação Setorial
          {industrySector && (
            <Badge variant="outline">{industrySector}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}`,
                    name === 'benchmark' ? 'Score Benchmark' :
                    name === 'percentile_25' ? 'Percentil 25' :
                    name === 'percentile_75' ? 'Percentil 75' : name
                  ]}
                />
                <Legend />
                <Bar dataKey="percentile_25" fill="#e5e7eb" name="Percentil 25" />
                <Bar dataKey="benchmark" fill="#3b82f6" name="Benchmark Médio" />
                <Bar dataKey="percentile_75" fill="#1f2937" name="Percentil 75" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benchmarks?.map(benchmark => (
                <div key={benchmark.id} className="p-3 border rounded-lg">
                  <div className="font-medium capitalize mb-2">
                    {benchmark.risk_category.replace(/_/g, ' ')}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Benchmark:</span>
                      <span className="font-medium">{benchmark.benchmark_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amostra:</span>
                      <span>{benchmark.sample_size} empresas</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fonte: {benchmark.data_source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum benchmark disponível para este setor
          </div>
        )}
      </CardContent>
    </Card>
  );
}
