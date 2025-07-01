
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/types/date";
import { Badge } from "@/components/ui/badge";

interface RiskIdentificationTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskIdentificationTable({ filters }: RiskIdentificationTableProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const risks = [
    {
      id: "PS001",
      description: "Sobrecarga de trabalho",
      type: "Psicossocial",
      sector: "Atendimento",
      role: "Atendente",
      identifiedAt: "12/01/2025",
      status: "Em análise"
    },
    {
      id: "PS002",
      description: "Assédio moral",
      type: "Psicossocial",
      sector: "Administrativo",
      role: "Assistente",
      identifiedAt: "15/01/2025",
      status: "Em análise"
    },
    {
      id: "FI001",
      description: "Ruído excessivo",
      type: "Físico",
      sector: "Produção",
      role: "Operador",
      identifiedAt: "20/01/2025",
      status: "Em análise"
    },
    {
      id: "ER001",
      description: "Postura inadequada",
      type: "Ergonômico",
      sector: "TI",
      role: "Analista",
      identifiedAt: "25/01/2025",
      status: "Em análise"
    },
    {
      id: "PS003",
      description: "Falta de autonomia",
      type: "Psicossocial",
      sector: "Comercial",
      role: "Vendedor",
      identifiedAt: "01/02/2025",
      status: "Em análise"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Identificado":
        return "default";
      case "Em análise":
        return "secondary";
      case "Planejado":
        return "outline";
      case "Em implementação":
        return "default";
      case "Controlado":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riscos Identificados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Descrição</th>
                <th className="text-left p-2">Tipo</th>
                <th className="text-left p-2">Setor</th>
                <th className="text-left p-2">Função</th>
                <th className="text-left p-2">Data de Identificação</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk) => (
                <tr key={risk.id} className="border-b">
                  <td className="p-2">{risk.id}</td>
                  <td className="p-2">{risk.description}</td>
                  <td className="p-2">{risk.type}</td>
                  <td className="p-2">{risk.sector}</td>
                  <td className="p-2">{risk.role}</td>
                  <td className="p-2">{risk.identifiedAt}</td>
                  <td className="p-2">
                    <Badge variant={getStatusColor(risk.status) as any}>
                      {risk.status}
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
