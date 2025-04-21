
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
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface EffectivenessEvaluationTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function EffectivenessEvaluationTable({ filters }: EffectivenessEvaluationTableProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const evaluations = [
    { 
      id: "PS001", 
      description: "Sobrecarga de trabalho no setor de atendimento",
      sector: "Atendimento",
      indicators: [
        { name: "Afastamentos por estresse", before: "7%", after: "5%", variation: -2, trend: "down" },
        { name: "Horas extras mensais", before: "16h", after: "10h", variation: -6, trend: "down" },
        { name: "Turnover no setor", before: "23%", after: "18%", variation: -5, trend: "down" },
        { name: "Satisfação (1-10)", before: "5,2", after: "6,8", variation: 1.6, trend: "up" }
      ],
      status: "Parcialmente controlado",
      effectiveness: "Média"
    },
    { 
      id: "PS002", 
      description: "Assédio moral na equipe comercial",
      sector: "Comercial",
      indicators: [
        { name: "Conflitos reportados", before: "12", after: "4", variation: -8, trend: "down" },
        { name: "Queixas formais", before: "5", after: "1", variation: -4, trend: "down" },
        { name: "Clima organizacional", before: "6,1", after: "7,5", variation: 1.4, trend: "up" },
        { name: "Turnover no setor", before: "25%", after: "18%", variation: -7, trend: "down" }
      ],
      status: "Bem controlado",
      effectiveness: "Alta"
    },
    { 
      id: "ER001", 
      description: "Postura inadequada no setor administrativo",
      sector: "Administrativo",
      indicators: [
        { name: "Queixas de dor", before: "65%", after: "40%", variation: -25, trend: "down" },
        { name: "Afastamentos", before: "3", after: "1", variation: -2, trend: "down" },
        { name: "Produtividade", before: "82%", after: "88%", variation: 6, trend: "up" }
      ],
      status: "Bem controlado",
      effectiveness: "Alta"
    },
    { 
      id: "AC001", 
      description: "Risco de queda na escada de acesso",
      sector: "Produção",
      indicators: [
        { name: "Incidentes reportados", before: "3", after: "0", variation: -3, trend: "down" },
        { name: "Quase-acidentes", before: "5", after: "1", variation: -4, trend: "down" },
        { name: "Percepção de segurança", before: "5,8", after: "8,2", variation: 2.4, trend: "up" }
      ],
      status: "Totalmente controlado",
      effectiveness: "Alta"
    },
  ];
  
  const statusOptions = [
    { value: "all", label: "Todos os status" },
    { value: "Totalmente controlado", label: "Totalmente controlado" },
    { value: "Bem controlado", label: "Bem controlado" },
    { value: "Parcialmente controlado", label: "Parcialmente controlado" },
    { value: "Não controlado", label: "Não controlado" },
  ];
  
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesStatus = statusFilter === "all" || evaluation.status === statusFilter;
    const matchesSearch = search === "" || 
      evaluation.description.toLowerCase().includes(search.toLowerCase()) ||
      evaluation.id.toLowerCase().includes(search.toLowerCase()) ||
      evaluation.sector.toLowerCase().includes(search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Totalmente controlado":
        return "success";
      case "Bem controlado":
        return "success";
      case "Parcialmente controlado":
        return "warning";
      case "Não controlado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "Alta":
        return "success";
      case "Média":
        return "warning";
      case "Baixa":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Avaliação de Eficácia</CardTitle>
          <div className="flex space-x-2">
            <div className="w-[250px]">
              <SearchableSelect
                options={statusOptions}
                value={statusFilter}
                onValueChange={setStatusFilter}
                placeholder="Filtrar por status"
              />
            </div>
            <div className="w-[250px]">
              <Input
                placeholder="Buscar avaliação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {filteredEvaluations.map((evaluation) => (
            <div key={evaluation.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{evaluation.id}</span>
                    <Badge variant={getStatusColor(evaluation.status) as any}>
                      {evaluation.status}
                    </Badge>
                    <Badge variant={getEffectivenessColor(evaluation.effectiveness) as any}>
                      Eficácia {evaluation.effectiveness}
                    </Badge>
                  </div>
                  <div className="text-lg font-medium mt-1">{evaluation.description}</div>
                  <div className="text-sm text-muted-foreground">Setor: {evaluation.sector}</div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicador</TableHead>
                    <TableHead className="text-center">Antes</TableHead>
                    <TableHead className="text-center">Depois</TableHead>
                    <TableHead className="text-center">Variação</TableHead>
                    <TableHead className="text-center">Tendência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluation.indicators.map((indicator, index) => (
                    <TableRow key={index}>
                      <TableCell>{indicator.name}</TableCell>
                      <TableCell className="text-center">{indicator.before}</TableCell>
                      <TableCell className="text-center">{indicator.after}</TableCell>
                      <TableCell className={`text-center ${indicator.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {indicator.variation > 0 ? '+' : ''}{indicator.variation}
                        {typeof indicator.variation === 'number' && indicator.variation % 1 === 0 ? '' : '%'}
                      </TableCell>
                      <TableCell className="text-center">
                        {getTrendIcon(indicator.trend)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
