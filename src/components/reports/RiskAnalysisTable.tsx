
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/types/date";
import { Badge } from "@/components/ui/badge";

interface RiskAnalysisTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskAnalysisTable({ filters }: RiskAnalysisTableProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const analysisData = [
    {
      id: "PS001",
      description: "Sobrecarga de trabalho",
      severity: "Alta",
      probability: "Média",
      riskLevel: 9,
      consequences: "Estresse, burnout, afastamentos",
      controlStrategy: "Mitigar"
    },
    {
      id: "PS002",
      description: "Assédio moral",
      severity: "Alta",
      probability: "Média",
      riskLevel: 9,
      consequences: "Ansiedade, depressão, turnover",
      controlStrategy: "Evitar"
    },
    {
      id: "PS003",
      description: "Falta de autonomia",
      severity: "Média",
      probability: "Alta",
      riskLevel: 6,
      consequences: "Desmotivação, turnover",
      controlStrategy: "Mitigar"
    },
    {
      id: "PS004",
      description: "Falta de reconhecimento",
      severity: "Média",
      probability: "Média",
      riskLevel: 4,
      consequences: "Desmotivação, baixa produtividade",
      controlStrategy: "Mitigar"
    },
    {
      id: "PS005",
      description: "Conflitos interpessoais",
      severity: "Média",
      probability: "Baixa",
      riskLevel: 2,
      consequences: "Clima organizacional ruim",
      controlStrategy: "Reter"
    },
  ];

  const getRiskLevelClass = (level: number) => {
    if (level >= 8) return "bg-red-100 text-red-800";
    if (level >= 4) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Riscos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Descrição</th>
                <th className="text-center p-2">Severidade</th>
                <th className="text-center p-2">Probabilidade</th>
                <th className="text-center p-2">Nível</th>
                <th className="text-left p-2">Consequências</th>
                <th className="text-center p-2">Estratégia</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-center">{item.severity}</td>
                  <td className="p-2 text-center">{item.probability}</td>
                  <td className="p-2 text-center">
                    <span className={`inline-block w-8 h-8 rounded-full ${getRiskLevelClass(item.riskLevel)} flex items-center justify-center font-bold`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="p-2">{item.consequences}</td>
                  <td className="p-2 text-center">
                    <Badge variant={item.controlStrategy === "Evitar" ? "destructive" : 
                           item.controlStrategy === "Mitigar" ? "default" : "outline"}>
                      {item.controlStrategy}
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
