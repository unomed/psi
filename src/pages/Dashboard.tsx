
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetricsReal } from "@/components/dashboard/DashboardMetricsReal";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { RecentAssessmentsReal } from "@/components/dashboard/RecentAssessmentsReal";
import { useCompany } from "@/contexts/CompanyContext";

export default function Dashboard() {
  const { selectedCompanyId } = useCompany();

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Dashboard"
        description="Visão geral do sistema de avaliação psicossocial"
      />

      <DashboardMetricsReal companyId={selectedCompanyId} />

      <DashboardQuickActions />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <RecentAssessmentsReal companyId={selectedCompanyId} />
      </div>
    </div>
  );
}
