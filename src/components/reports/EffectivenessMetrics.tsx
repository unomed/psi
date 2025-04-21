
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "@/types/date";

interface EffectivenessMetricsProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function EffectivenessMetrics({ filters }: EffectivenessMetricsProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const metrics = [
    {
      riskId: "PS001",
      description: "Sobrecarga de trabalho",
      beforeRiskLevel: 8,
      currentRiskLevel: 5,
      targetRiskLevel: 3,
      effectiveness: "Média",
      status: "Em progresso",
    },
    {
      riskId: "PS002",
      description: "Assédio moral",
      beforeRiskLevel: 9,
      currentRiskLevel: 4,
      targetRiskLevel: 2,
      effectiveness: "Alta",
      status: "Em progresso",
    },
    {
      riskId: "PS003",
      description: "Baixa autonomia",
      beforeRiskLevel: 7,
      currentRiskLevel: 2,
      targetRiskLevel: 2,
      effectiveness: "Alta",
      status: "Concluído",
    },
    {
      riskId: "PS004",
      description: "Falta de reconhecimento",
      beforeRiskLevel: 6,
      currentRiskLevel: 3,
      targetRiskLevel: 2,
      effectiveness: "Média",
      status: "Em progresso",
    },
  ];

  // Função para determinar a cor do badge baseado na efetividade
  const getEffectivenessBadgeVariant = (effectiveness: string) => {
    switch (effectiveness) {
      case "Alta":
        return "success";
      case "Média":
        return "default";
      case "Baixa":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Função para determinar a cor do badge baseado no status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Concluído":
        return "success";
      case "Em progresso":
        return "default";
      case "Atrasado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Métricas de Eficácia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Risco</th>
                <th className="text-center p-2">Nível Anterior</th>
                <th className="text-center p-2">Nível Atual</th>
                <th className="text-center p-2">Meta</th>
                <th className="text-center p-2">Eficácia</th>
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.riskId} className="border-b">
                  <td className="p-2">
                    <div className="font-medium">{metric.riskId}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </td>
                  <td className="text-center p-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold">
                      {metric.beforeRiskLevel}
                    </span>
                  </td>
                  <td className="text-center p-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      {metric.currentRiskLevel}
                    </span>
                  </td>
                  <td className="text-center p-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">
                      {metric.targetRiskLevel}
                    </span>
                  </td>
                  <td className="text-center p-2">
                    <Badge variant={getEffectivenessBadgeVariant(metric.effectiveness)}>
                      {metric.effectiveness}
                    </Badge>
                  </td>
                  <td className="text-center p-2">
                    <Badge variant={getStatusBadgeVariant(metric.status)}>
                      {metric.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
