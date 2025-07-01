
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TagStatistics {
  totalTags: number;
  categoryDistribution: Record<string, number>;
  hasExpiredTags: boolean;
}

interface PerformanceMetrics {
  tagsCount: number;
  isOptimized: boolean;
  hasRealTime: boolean;
  cacheStatus: string;
}

interface TagsAnalyticsTabProps {
  tagStatistics: TagStatistics;
  performanceMetrics: PerformanceMetrics;
}

export function TagsAnalyticsTab({ tagStatistics, performanceMetrics }: TagsAnalyticsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(tagStatistics.categoryDistribution).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="capitalize">{category}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cache Status:</span>
                <Badge variant="outline">{performanceMetrics.cacheStatus}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Otimização:</span>
                <Badge variant={performanceMetrics.isOptimized ? "default" : "secondary"}>
                  {performanceMetrics.isOptimized ? "Ativa" : "Desabilitada"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Tempo Real:</span>
                <Badge variant={performanceMetrics.hasRealTime ? "default" : "secondary"}>
                  {performanceMetrics.hasRealTime ? "Ativo" : "Desabilitado"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
