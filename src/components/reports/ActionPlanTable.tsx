
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/types/date";
import { Badge } from "@/components/ui/badge";

interface ActionPlanTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ActionPlanTable({ filters }: ActionPlanTableProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const actionPlans = [
    {
      riskId: "PS001",
      riskDescription: "Sobrecarga de trabalho",
      action: "Implementar sistema de priorização de tarefas",
      responsible: "Maria Silva (RH)",
      deadline: "15/06/2025",
      status: "Não iniciada"
    },
    {
      riskId: "PS001",
      riskDescription: "Sobrecarga de trabalho",
      action: "Realizar reuniões semanais com equipe",
      responsible: "Carlos Mendes (Supervisor)",
      deadline: "01/06/2025",
      status: "Em andamento"
    },
    {
      riskId: "PS001",
      riskDescription: "Sobrecarga de trabalho",
      action: "Implementar pausas obrigatórias no sistema",
      responsible: "Joana Lima (TI)",
      deadline: "30/06/2025",
      status: "Não iniciada"
    },
    {
      riskId: "PS002",
      riskDescription: "Assédio moral",
      action: "Treinamento de lideranças sobre assédio",
      responsible: "Paulo Freitas (RH)",
      deadline: "10/07/2025",
      status: "Não iniciada"
    },
    {
      riskId: "PS003",
      riskDescription: "Falta de autonomia",
      action: "Redesenho de processos de trabalho",
      responsible: "Sandra Moura (Consultoria)",
      deadline: "20/08/2025",
      status: "Não iniciada"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "success";
      case "Em andamento":
        return "default";
      case "Não iniciada":
        return "secondary";
      case "Atrasada":
        return "destructive";
      case "Cancelada":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos de Ação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Risco</th>
                <th className="text-left p-2">Ação</th>
                <th className="text-left p-2">Responsável</th>
                <th className="text-left p-2">Prazo</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {actionPlans.map((plan, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <div className="font-medium">{plan.riskId}</div>
                    <div className="text-sm text-muted-foreground">{plan.riskDescription}</div>
                  </td>
                  <td className="p-2">{plan.action}</td>
                  <td className="p-2">{plan.responsible}</td>
                  <td className="p-2">{plan.deadline}</td>
                  <td className="p-2">
                    <Badge variant={getStatusColor(plan.status) as any}>
                      {plan.status}
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
