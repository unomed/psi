
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/types/date";

interface ActionImplementationTimelineProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ActionImplementationTimeline({ filters }: ActionImplementationTimelineProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const implementations = [
    {
      date: "01/05/2025",
      action: "Implementação inicial do sistema de priorização",
      status: "Concluído",
      comments: "Sistema inicial implementado conforme planejado"
    },
    {
      date: "10/05/2025",
      action: "Treinamento da equipe no novo sistema",
      status: "Concluído",
      comments: "Todos os colaboradores participaram do treinamento"
    },
    {
      date: "15/05/2025",
      action: "Ajustes no sistema baseado no feedback",
      status: "Em andamento",
      comments: "Ajustes sendo realizados pela equipe de TI"
    },
    {
      date: "Hoje",
      action: "Avaliação da efetividade da implementação",
      status: "Em andamento",
      comments: "Coleta de métricas em andamento"
    },
    {
      date: "01/06/2025",
      action: "Implantação das pausas obrigatórias",
      status: "Planejado",
      comments: "Próxima etapa da implementação"
    },
    {
      date: "15/06/2025",
      action: "Avaliação final e ajustes",
      status: "Planejado",
      comments: "Etapa final do plano de implementação"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-600";
      case "Em andamento":
        return "bg-blue-600";
      case "Planejado":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Linha do Tempo de Implementação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          <div className="space-y-8 relative">
            {implementations.map((item, index) => (
              <div key={index} className="relative pl-10">
                <div className={`absolute left-3 w-5 h-5 -ml-2.5 rounded-full ${getStatusColor(item.status)}`}></div>
                <div className="text-xs text-gray-500 mb-1">{item.date}</div>
                <div className="font-medium">{item.action}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.comments}</div>
                <div className="text-xs mt-1">
                  <span className={`px-2 py-1 rounded-full ${
                    item.status === "Concluído" ? "bg-green-100 text-green-800" :
                    item.status === "Em andamento" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
