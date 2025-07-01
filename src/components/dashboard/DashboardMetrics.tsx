
import { AlertTriangle, Calendar, CheckCircle2, ClipboardList } from "lucide-react";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";

interface DashboardMetricsProps {
  companyId: string | null;
}

export function DashboardMetrics({ companyId }: DashboardMetricsProps) {
  // Legacy component - kept for compatibility
  // Use DashboardMetricsReal for real data
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardMetricCard
        title="Avaliações Pendentes"
        value={0}
        description="Aguardando conclusão"
        icon={ClipboardList}
        className="bg-amber-50"
      />
      <DashboardMetricCard
        title="Avaliações Concluídas"
        value={0}
        description="Total"
        icon={CheckCircle2}
        className="bg-green-50"
      />
      <DashboardMetricCard
        title="Funcionários em Risco Alto"
        value={0}
        description="Necessitam atenção"
        icon={AlertTriangle}
        className="bg-red-50"
      />
      <DashboardMetricCard
        title="Próximas Reavaliações"
        value={0}
        description="Nos próximos 30 dias"
        icon={Calendar}
        className="bg-blue-50"
      />
    </div>
  );
}
