
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, TrendingUp, Clock } from "lucide-react";

interface TagAnalysis {
  compliance: number;
  missingRequired: number;
  expiredTags: number;
  totalRequired: number;
}

interface TagStatistics {
  totalTags: number;
  categoryDistribution: Record<string, number>;
  hasExpiredTags: boolean;
}

interface TagMetricsCardsProps {
  tagAnalysis: TagAnalysis;
  tagStatistics: TagStatistics;
}

export function TagMetricsCards({ tagAnalysis, tagStatistics }: TagMetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Conformidade</p>
              <p className="text-2xl font-bold text-green-600">
                {tagAnalysis.compliance.toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">Tags em Falta</p>
              <p className="text-2xl font-bold text-yellow-600">
                {tagAnalysis.missingRequired}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Total de Tags</p>
              <p className="text-2xl font-bold text-blue-600">
                {tagStatistics.totalTags}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-sm font-medium">Expiradas</p>
              <p className="text-2xl font-bold text-red-600">
                {tagAnalysis.expiredTags}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
