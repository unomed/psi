import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";

interface EffectivenessMetricsProps {
  implementationRate: number;
  riskReduction: number;
  overallEffectiveness: number;
}

export function EffectivenessMetrics({ implementationRate, riskReduction, overallEffectiveness }: EffectivenessMetricsProps) {

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Implementação
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{implementationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              das ações foram implementadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Redução de Riscos
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskReduction.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              redução média dos riscos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Efetividade Geral
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{overallEffectiveness.toFixed(1)}%</div>
              <Badge variant={overallEffectiveness >= 80 ? "default" : overallEffectiveness >= 60 ? "secondary" : "destructive"}>
                {overallEffectiveness >= 80 ? "Excelente" : overallEffectiveness >= 60 ? "Bom" : "Precisa melhorar"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              efetividade geral das ações
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
