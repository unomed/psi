
import { RiskLevelChart } from "@/components/dashboard/RiskLevelChart";
import { SectorRiskChart } from "@/components/dashboard/SectorRiskChart";

interface DashboardChartsProps {
  companyId: string | null;
}

export function DashboardCharts({ companyId }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RiskLevelChart companyId={companyId} />
      <SectorRiskChart companyId={companyId} />
    </div>
  );
}
