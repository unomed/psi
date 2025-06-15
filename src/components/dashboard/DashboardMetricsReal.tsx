
import { AlertTriangle, Calendar, CheckCircle2, ClipboardList, Users, TrendingUp } from "lucide-react";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { useDashboardData } from "@/hooks/useDashboardData";

interface DashboardMetricsRealProps {
  companyId: string | null;
}

export function DashboardMetricsReal({ companyId }: DashboardMetricsRealProps) {
  const { metrics, isLoading } = useDashboardData(companyId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Selecione uma empresa para ver as métricas
      </div>
    );
  }

  const totalRiskEmployees = metrics.highRiskEmployees + metrics.criticalRiskEmployees;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardMetricCard
        title="Total de Funcionários"
        value={metrics.totalEmployees}
        description="Cadastrados no sistema"
        icon={Users}
        className="bg-blue-50"
      />
      
      <DashboardMetricCard
        title="Avaliações Pendentes"
        value={metrics.pendingAssessments}
        description="Aguardando conclusão"
        icon={ClipboardList}
        className="bg-amber-50"
      />
      
      <DashboardMetricCard
        title="Avaliações Concluídas"
        value={metrics.completedAssessments}
        description="Total realizado"
        icon={CheckCircle2}
        className="bg-green-50"
      />
      
      <DashboardMetricCard
        title="Funcionários em Risco"
        value={totalRiskEmployees}
        description={`${metrics.criticalRiskEmployees} crítico, ${metrics.highRiskEmployees} alto`}
        icon={AlertTriangle}
        className="bg-red-50"
      />
      
      <DashboardMetricCard
        title="Próximas Reavaliações"
        value={metrics.upcomingReassessments}
        description="Nos próximos 30 dias"
        icon={Calendar}
        className="bg-purple-50"
      />
      
      <DashboardMetricCard
        title="Taxa de Conclusão"
        value={metrics.totalEmployees > 0 ? Math.round((metrics.completedAssessments / metrics.totalEmployees) * 100) : 0}
        description="% de funcionários avaliados"
        icon={TrendingUp}
        className="bg-indigo-50"
        suffix="%"
      />
    </div>
  );
}
