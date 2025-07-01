
import { RiskLevelChart } from "@/components/dashboard/RiskLevelChart";
import { SectorRiskChart } from "@/components/dashboard/SectorRiskChart";
import { RoleRiskChart } from "@/components/dashboard/RoleRiskChart";

interface DashboardChartsProps {
  companyId: string | null;
}

export function DashboardCharts({ companyId }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RiskLevelChart companyId={companyId} />
      <SectorRiskChart companyId={companyId} />
      <RoleRiskChart companyId={companyId} />
    </div>
  );
}
