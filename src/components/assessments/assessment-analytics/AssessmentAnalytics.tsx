
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react";

interface AssessmentAnalyticsProps {
  companyId?: string | null;
}

export function AssessmentAnalytics({ companyId }: AssessmentAnalyticsProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['assessmentAnalytics', companyId],
    queryFn: async () => {
      // Get assessment results
      let query = supabase
        .from('assessment_responses')
        .select(`
          *,
          checklist_templates(type),
          employees(company_id, sector_id, role_id)
        `);

      if (companyId) {
        const { data: companyEmployees } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);

        if (companyEmployees) {
          const employeeIds = companyEmployees.map(emp => emp.id);
          query = query.in('employee_id', employeeIds);
        }
      }

      const { data: results, error } = await query;
      if (error) throw error;

      // Process data for analytics
      const totalAssessments = results.length;
      const completedThisMonth = results.filter(r => {
        const completedDate = new Date(r.completed_at);
        const now = new Date();
        return completedDate.getMonth() === now.getMonth() && 
               completedDate.getFullYear() === now.getFullYear();
      }).length;

      // Risk distribution
      const riskDistribution = results.reduce((acc, result) => {
        if (result.factors_scores) {
          const scores = Object.values(result.factors_scores) as number[];
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          
          const riskLevel = 
            avgScore >= 0.8 ? 'Alto' :
            avgScore >= 0.6 ? 'Médio' :
            'Baixo';
          
          acc[riskLevel] = (acc[riskLevel] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Assessment types
      const typeDistribution = results.reduce((acc, result) => {
        const type = result.checklist_templates?.type || 'custom';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Monthly trend (last 6 months)
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        const count = results.filter(r => {
          const completedDate = new Date(r.completed_at);
          return completedDate.getMonth() === date.getMonth() && 
                 completedDate.getFullYear() === date.getFullYear();
        }).length;
        
        monthlyTrend.push({
          month: monthYear,
          assessments: count
        });
      }

      const highRiskCount = riskDistribution['Alto'] || 0;
      const riskPercentage = totalAssessments > 0 ? (highRiskCount / totalAssessments) * 100 : 0;

      return {
        totalAssessments,
        completedThisMonth,
        highRiskCount,
        riskPercentage,
        riskDistribution: Object.entries(riskDistribution).map(([level, count]) => ({
          level,
          count,
          color: level === 'Alto' ? '#ef4444' : level === 'Médio' ? '#f59e0b' : '#10b981'
        })),
        typeDistribution: Object.entries(typeDistribution).map(([type, count]) => ({
          type: type.toUpperCase(),
          count
        })),
        monthlyTrend
      };
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando análises...</div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado disponível para análise
          </div>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Métricas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Avaliações</p>
                <p className="text-2xl font-bold">{analytics.totalAssessments}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">{analytics.completedThisMonth}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alto Risco</p>
                <p className="text-2xl font-bold text-red-600">{analytics.highRiskCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">% Alto Risco</p>
                <p className="text-2xl font-bold text-red-600">
                  {analytics.riskPercentage.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Risco */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  nameKey="level"
                  label={({ level, count }) => `${level}: ${count}`}
                >
                  {analytics.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tipos de Avaliação */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.typeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendência Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Avaliações (Últimos 6 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="assessments" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
