
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface RiskAnalysisTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskAnalysisTable({ filters }: RiskAnalysisTableProps) {
  const [riskLevelFilter, setRiskLevelFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const risks = [
    { id: "PS001", description: "Sobrecarga de trabalho no setor de atendimento", sector: "Atendimento", severity: "Alta", probability: "Média", riskLevel: "Alto", value: 9 },
    { id: "PS002", description: "Assédio moral na equipe comercial", sector: "Comercial", severity: "Alta", probability: "Alta", riskLevel: "Crítico", value: 12 },
    { id: "ER001", description: "Postura inadequada no setor administrativo", sector: "Administrativo", severity: "Baixa", probability: "Alta", riskLevel: "Médio", value: 6 },
    { id: "AC001", description: "Risco de queda na escada de acesso", sector: "Produção", severity: "Alta", probability: "Baixa", riskLevel: "Médio", value: 6 },
    { id: "QM001", description: "Exposição a solventes no laboratório", sector: "Laboratório", severity: "Média", probability: "Média", riskLevel: "Médio", value: 6 },
    { id: "PS003", description: "Falta de autonomia na equipe de desenvolvimento", sector: "TI", severity: "Baixa", probability: "Baixa", riskLevel: "Baixo", value: 2 },
  ];
  
  const riskLevelOptions = [
    { value: "all", label: "Todos os níveis" },
    { value: "Crítico", label: "Crítico" },
    { value: "Alto", label: "Alto" },
    { value: "Médio", label: "Médio" },
    { value: "Baixo", label: "Baixo" },
  ];
  
  const filteredRisks = risks.filter(risk => {
    const matchesLevel = riskLevelFilter === "all" || risk.riskLevel === riskLevelFilter;
    const matchesSearch = search === "" || 
      risk.description.toLowerCase().includes(search.toLowerCase()) ||
      risk.id.toLowerCase().includes(search.toLowerCase()) ||
      risk.sector.toLowerCase().includes(search.toLowerCase());
    
    return matchesLevel && matchesSearch;
  });

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Crítico":
        return "destructive";
      case "Alto":
        return "destructive";
      case "Médio":
        return "warning";
      case "Baixo":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Análise de Riscos</CardTitle>
          <div className="flex space-x-2">
            <div className="w-[200px]">
              <SearchableSelect
                options={riskLevelOptions}
                value={riskLevelFilter}
                onValueChange={setRiskLevelFilter}
                placeholder="Filtrar por nível"
              />
            </div>
            <div className="w-[250px]">
              <Input
                placeholder="Buscar risco..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Severidade</TableHead>
              <TableHead>Probabilidade</TableHead>
              <TableHead>Nível de Risco</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.id}</TableCell>
                <TableCell>{risk.description}</TableCell>
                <TableCell>{risk.sector}</TableCell>
                <TableCell>{risk.severity}</TableCell>
                <TableCell>{risk.probability}</TableCell>
                <TableCell>
                  <Badge variant={getRiskLevelColor(risk.riskLevel) as any}>
                    {risk.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold">{risk.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
