
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRiskLevelData } from "@/hooks/dashboard/useRiskLevelData";
import { RiskChartSkeleton } from "./risk/RiskChartSkeleton";
import { RiskPieChart } from "./risk/RiskPieChart";

interface RiskLevelChartProps {
  companyId: string | null;
}

export function RiskLevelChart({ companyId }: RiskLevelChartProps) {
  const { data, loading } = useRiskLevelData(companyId);

  if (loading) {
    return <RiskChartSkeleton />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição de Níveis de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <RiskPieChart data={data} />
      </CardContent>
    </Card>
  );
}
