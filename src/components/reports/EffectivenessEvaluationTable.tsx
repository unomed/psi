
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/types/date";
import { Badge } from "@/components/ui/badge";

interface EffectivenessEvaluationTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function EffectivenessEvaluationTable({ filters }: EffectivenessEvaluationTableProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const evaluations = [
    {
      riskId: "PS001",
      description: "Sobrecarga de trabalho",
      beforeRiskLevel: 8,
      afterRiskLevel: 5,
      targetRiskLevel: 3,
      evaluatedAt: "15/06/2025",
      effectiveness: "Média",
      additionalActions: "Realizar ajustes na distribuição de tarefas",
      status: "Em progresso"
    },
    {
      riskId: "PS002",
      description: "Assédio moral",
      beforeRiskLevel: 9,
      afterRiskLevel: 4,
      targetRiskLevel: 2,
      evaluatedAt: "20/06/2025",
      effectiveness: "Alta",
      additionalActions: "Manter monitoramento regular",
      status: "Em progresso"
    },
    {
      riskId: "PS003",
      description: "Baixa autonomia",
      beforeRiskLevel: 7,
      afterRiskLevel: 2,
      targetRiskLevel: 2,
      evaluatedAt: "01/06/2025",
      effectiveness: "Alta",
      additionalActions: "Nenhuma ação adicional necessária",
      status: "Concluído"
    },
    {
      riskId: "PS004",
      description: "Falta de reconhecimento",
      beforeRiskLevel: 6,
      afterRiskLevel: 3,
      targetRiskLevel: 2,
      evaluatedAt: "10/06/2025",
      effectiveness: "Média",
      additionalActions: "Implementar programa de reconhecimento",
      status: "Em progresso"
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
      case "Não iniciado":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliação de Eficácia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Risco</th>
                <th className="text-center p-2">Nível Anterior</th>
                <th className="text-center p-2">Nível Atual</th>
                <th className="text-center p-2">Meta</th>
                <th className="text-left p-2">Data de Avaliação</th>
                <th className="text-center p-2">Eficácia</th>
                <th className="text-left p-2">Ações Adicionais</th>
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.riskId} className="border-b">
                  <td className="p-2">
                    <div className="font-medium">{evaluation.riskId}</div>
                    <div className="text-sm text-muted-foreground">{evaluation.description}</div>
                  </td>
                  <td className="text-center p-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold">
                      {evaluation.beforeRiskLevel}
                    </span>
                  </td>
                  <td className="text-center p-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      {evaluation.afterRiskLevel}
                    </span>
                  </td>
                  <td className="text-center p-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">
                      {evaluation.targetRiskLevel}
                    </span>
                  </td>
                  <td className="p-2">{evaluation.evaluatedAt}</td>
                  <td className="text-center p-2">
                    <Badge variant={getEffectivenessBadgeVariant(evaluation.effectiveness) as any}>
                      {evaluation.effectiveness}
                    </Badge>
                  </td>
                  <td className="p-2">{evaluation.additionalActions}</td>
                  <td className="text-center p-2">
                    <Badge variant={getStatusBadgeVariant(evaluation.status) as any}>
                      {evaluation.status}
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
