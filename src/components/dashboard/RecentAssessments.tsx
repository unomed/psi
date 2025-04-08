
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Mock data for recent assessments
const recentAssessments = [
  {
    id: 1,
    employee: "João Silva",
    sector: "Produção",
    date: "2025-04-05",
    riskLevel: "Alto",
  },
  {
    id: 2,
    employee: "Maria Santos",
    sector: "Administrativo",
    date: "2025-04-04",
    riskLevel: "Baixo",
  },
  {
    id: 3,
    employee: "Carlos Oliveira",
    sector: "TI",
    date: "2025-04-03",
    riskLevel: "Médio",
  },
  {
    id: 4,
    employee: "Ana Costa",
    sector: "Comercial",
    date: "2025-04-02",
    riskLevel: "Baixo",
  },
  {
    id: 5,
    employee: "Pedro Souza",
    sector: "Logística",
    date: "2025-04-01",
    riskLevel: "Médio",
  },
];

export function RecentAssessments() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Avaliações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-medium">Funcionário</th>
                <th className="py-3 text-left font-medium">Setor</th>
                <th className="py-3 text-left font-medium">Data</th>
                <th className="py-3 text-left font-medium">Nível de Risco</th>
                <th className="py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentAssessments.map((assessment) => (
                <tr key={assessment.id} className="border-b last:border-0">
                  <td className="py-3">{assessment.employee}</td>
                  <td className="py-3">{assessment.sector}</td>
                  <td className="py-3">{new Date(assessment.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3">
                    <Badge
                      variant="outline"
                      className={
                        assessment.riskLevel === "Alto"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : assessment.riskLevel === "Médio"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {assessment.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
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
