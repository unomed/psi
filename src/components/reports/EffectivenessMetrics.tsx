
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";

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
      id: "PS001", 
      description: "Sobrecarga de trabalho no setor de atendimento",
      before: 8,
      after: 6,
      target: 4,
      status: "Em progresso",
      controlStatus: "Parcialmente controlado"
    },
    { 
      id: "PS002", 
      description: "Assédio moral na equipe comercial",
      before: 9,
      after: 5,
      target: 3,
      status: "Satisfatório",
      controlStatus: "Bem controlado"
    },
    { 
      id: "ER001", 
      description: "Postura inadequada no setor administrativo",
      before: 6,
      after: 4,
      target: 3,
      status: "Satisfatório",
      controlStatus: "Bem controlado"
    },
    { 
      id: "AC001", 
      description: "Risco de queda na escada de acesso",
      before: 8,
      after: 3,
      target: 2,
      status: "Excelente",
      controlStatus: "Totalmente controlado"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Excelente":
        return <Badge variant="success">{status}</Badge>;
      case "Satisfatório":
        return <Badge variant="success">{status}</Badge>;
      case "Em progresso":
        return <Badge variant="warning">{status}</Badge>;
      case "Insatisfatório":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getControlStatusBadge = (status: string) => {
    switch (status) {
      case "Totalmente controlado":
        return <Badge variant="success">{status}</Badge>;
      case "Bem controlado":
        return <Badge variant="success">{status}</Badge>;
      case "Parcialmente controlado":
        return <Badge variant="warning">{status}</Badge>;
      case "Não controlado":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Métricas de Eficácia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold">{metric.id}</div>
                  <div className="text-sm">{metric.description}</div>
                </div>
                <div className="flex space-x-2">
                  {getStatusBadge(metric.status)}
                  {getControlStatusBadge(metric.controlStatus)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 border rounded bg-amber-50">
                  <div className="text-center">
                    <div className="text-sm text-amber-600 font-semibold">Antes</div>
                    <div className="text-xl font-bold">{metric.before}</div>
                    <div className="text-xs text-muted-foreground">Nível de Risco</div>
                  </div>
                </div>
                <div className="p-2 border rounded bg-blue-50">
                  <div className="text-center">
                    <div className="text-sm text-blue-600 font-semibold">Atual</div>
                    <div className="text-xl font-bold">{metric.after}</div>
                    <div className="text-xs text-muted-foreground">Nível de Risco</div>
                  </div>
                </div>
                <div className="p-2 border rounded bg-green-50">
                  <div className="text-center">
                    <div className="text-sm text-green-600 font-semibold">Meta</div>
                    <div className="text-xl font-bold">{metric.target}</div>
                    <div className="text-xs text-muted-foreground">Nível de Risco</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
