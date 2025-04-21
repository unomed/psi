
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

interface RiskIdentificationTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskIdentificationTable({ filters }: RiskIdentificationTableProps) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const risks = [
    { id: "PS001", type: "Psicossocial", description: "Sobrecarga de trabalho no setor de atendimento", sector: "Atendimento", date: "15/03/2025", category: "Sobrecarga" },
    { id: "PS002", type: "Psicossocial", description: "Assédio moral na equipe comercial", sector: "Comercial", date: "20/03/2025", category: "Assédio" },
    { id: "ER001", type: "Ergonômico", description: "Postura inadequada no setor administrativo", sector: "Administrativo", date: "10/03/2025", category: "Postura" },
    { id: "AC001", type: "Acidente", description: "Risco de queda na escada de acesso", sector: "Produção", date: "05/03/2025", category: "Queda" },
    { id: "QM001", type: "Químico", description: "Exposição a solventes no laboratório", sector: "Laboratório", date: "01/03/2025", category: "Solventes" },
    { id: "PS003", type: "Psicossocial", description: "Falta de autonomia na equipe de desenvolvimento", sector: "TI", date: "12/03/2025", category: "Autonomia" },
  ];
  
  const typeOptions = [
    { value: "all", label: "Todos os tipos" },
    { value: "Psicossocial", label: "Psicossocial" },
    { value: "Ergonômico", label: "Ergonômico" },
    { value: "Acidente", label: "Acidente" },
    { value: "Químico", label: "Químico" },
    { value: "Físico", label: "Físico" },
    { value: "Biológico", label: "Biológico" },
  ];
  
  const filteredRisks = risks.filter(risk => {
    const matchesType = typeFilter === "all" || risk.type === typeFilter;
    const matchesSearch = search === "" || 
      risk.description.toLowerCase().includes(search.toLowerCase()) ||
      risk.id.toLowerCase().includes(search.toLowerCase()) ||
      risk.sector.toLowerCase().includes(search.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Riscos Identificados</CardTitle>
          <div className="flex space-x-2">
            <div className="w-[200px]">
              <SearchableSelect
                options={typeOptions}
                value={typeFilter}
                onValueChange={setTypeFilter}
                placeholder="Filtrar por tipo"
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
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.id}</TableCell>
                <TableCell>
                  <Badge variant={risk.type === "Psicossocial" ? "destructive" : "secondary"}>
                    {risk.type}
                  </Badge>
                </TableCell>
                <TableCell>{risk.description}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>{risk.sector}</TableCell>
                <TableCell>{risk.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
