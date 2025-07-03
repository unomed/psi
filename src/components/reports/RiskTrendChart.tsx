
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface RiskTrendChartProps {
  filters: {
    selectedCompany: string | null;
    dateRange: any;
    selectedSector: string;
    selectedRole: string;
  };
}

export function RiskTrendChart({ filters }: RiskTrendChartProps) {
  const { data: trendData, isLoading } = useQuery({
    queryKey: ['riskTrend', filters.selectedCompany, filters.selectedSector, filters.selectedRole],
    queryFn: async () => {
      let query = supabase
        .from('assessment_responses')
        .select(`
          completed_at,
          percentile,
          employees!inner(company_id, sector_id, role_id)
        `)
        .not('completed_at', 'is', null);

      if (filters.selectedCompany) {
        query = query.eq('employees.company_id', filters.selectedCompany);
      }

      if (filters.selectedSector && filters.selectedSector !== 'all-sectors') {
        query = query.eq('employees.sector_id', filters.selectedSector);
      }

      if (filters.selectedRole && filters.selectedRole !== 'all-roles') {
        query = query.eq('employees.role_id', filters.selectedRole);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Agrupar por mês e calcular médias
      const monthlyData: Record<string, { total: number; high: number; medium: number; low: number; avg: number }> = {};

      data?.forEach(assessment => {
        const date = new Date(assessment.completed_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { total: 0, high: 0, medium: 0, low: 0, avg: 0 };
        }

        monthlyData[monthKey].total++;
        
        if (assessment.percentile) {
          if (assessment.percentile >= 70) monthlyData[monthKey].high++;
          else if (assessment.percentile >= 30) monthlyData[monthKey].medium++;
          else monthlyData[monthKey].low++;
        }
      });

      // Converter para array e calcular médias
      return Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          total: data.total,
          highRisk: data.high,
          mediumRisk: data.medium,
          lowRisk: data.low,
          highRiskPercentage: data.total > 0 ? (data.high / data.total) * 100 : 0,
          mediumRiskPercentage: data.total > 0 ? (data.medium / data.total) * 100 : 0,
          lowRiskPercentage: data.total > 0 ? (data.low / data.total) * 100 : 0
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Últimos 6 meses
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Riscos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Riscos (Últimos 6 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year}`;
                }}
              />
              <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                labelFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year}`;
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === 'highRiskPercentage' ? 'Alto Risco' :
                  name === 'mediumRiskPercentage' ? 'Médio Risco' : 'Baixo Risco'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="highRiskPercentage" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Alto Risco"
              />
              <Line 
                type="monotone" 
                dataKey="mediumRiskPercentage" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Médio Risco"
              />
              <Line 
                type="monotone" 
                dataKey="lowRiskPercentage" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Baixo Risco"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
