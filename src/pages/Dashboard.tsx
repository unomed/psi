
import { AlertTriangle, Calendar, CheckCircle2, ClipboardList } from "lucide-react";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { RiskLevelChart } from "@/components/dashboard/RiskLevelChart";
import { SectorRiskChart } from "@/components/dashboard/SectorRiskChart";
import { RecentAssessments } from "@/components/dashboard/RecentAssessments";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do monitoramento de riscos psicossociais na sua empresa.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Avaliações Pendentes"
          value={24}
          description="Aguardando conclusão"
          icon={ClipboardList}
          className="bg-amber-50"
        />
        <DashboardMetricCard
          title="Avaliações Concluídas"
          value={215}
          description="Último mês"
          icon={CheckCircle2}
          change={{ value: "12%", trend: "up" }}
          className="bg-green-50"
        />
        <DashboardMetricCard
          title="Funcionários em Risco Alto"
          value={12}
          description="Necessitam atenção"
          icon={AlertTriangle}
          change={{ value: "3%", trend: "down" }}
          className="bg-red-50"
        />
        <DashboardMetricCard
          title="Próximas Reavaliações"
          value={8}
          description="Nos próximos 30 dias"
          icon={Calendar}
          className="bg-blue-50"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RiskLevelChart />
        <SectorRiskChart />
      </div>

      <RecentAssessments />
    </div>
  );
}
