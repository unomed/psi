
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/types/date";
import { Badge } from "@/components/ui/badge";

interface ImplementationDetailsTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ImplementationDetailsTable({ filters }: ImplementationDetailsTableProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const implementationDetails = [
    {
      id: "IMP001",
      riskId: "PS001",
      action: "Implementar sistema de priorização de tarefas",
      startDate: "01/05/2025",
      endDate: "15/05/2025",
      responsible: "Maria Silva (RH)",
      resources: "Sistema de gestão de tarefas",
      status: "Concluída",
      comments: "Implementado com sucesso, feedback positivo"
    },
    {
      id: "IMP002",
      riskId: "PS001",
      action: "Realizar reuniões semanais com equipe",
      startDate: "05/05/2025",
      endDate: "Em andamento",
      responsible: "Carlos Mendes (Supervisor)",
      resources: "Sala de reuniões, agenda compartilhada",
      status: "Em andamento",
      comments: "Reuniões ocorrendo semanalmente conforme planejado"
    },
    {
      id: "IMP003",
      riskId: "PS001",
      action: "Implementar pausas obrigatórias no sistema",
      startDate: "Não iniciada",
      endDate: "-",
      responsible: "Joana Lima (TI)",
      resources: "Equipe de TI, ajustes no sistema",
      status: "Não iniciada",
      comments: "Aguardando conclusão das etapas anteriores"
    },
    {
      id: "IMP004",
      riskId: "PS002",
      action: "Treinamento de lideranças sobre assédio",
      startDate: "Não iniciada",
      endDate: "-",
      responsible: "Paulo Freitas (RH)",
      resources: "Material de treinamento, sala",
      status: "Não iniciada",
      comments: "Planejamento em andamento"
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
        <CardTitle>Detalhes de Implementação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Risco</th>
                <th className="text-left p-2">Ação</th>
                <th className="text-left p-2">Início</th>
                <th className="text-left p-2">Término</th>
                <th className="text-left p-2">Responsável</th>
                <th className="text-center p-2">Status</th>
                <th className="text-left p-2">Comentários</th>
              </tr>
            </thead>
            <tbody>
              {implementationDetails.map((detail) => (
                <tr key={detail.id} className="border-b">
                  <td className="p-2">{detail.id}</td>
                  <td className="p-2">{detail.riskId}</td>
                  <td className="p-2">{detail.action}</td>
                  <td className="p-2">{detail.startDate}</td>
                  <td className="p-2">{detail.endDate}</td>
                  <td className="p-2">{detail.responsible}</td>
                  <td className="p-2 text-center">
                    <Badge variant={getStatusColor(detail.status) as any}>
                      {detail.status}
                    </Badge>
                  </td>
                  <td className="p-2">{detail.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
