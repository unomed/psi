
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RiskChartSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição de Níveis de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
