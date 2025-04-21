
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

interface ActionPlanTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ActionPlanTable({ filters }: ActionPlanTableProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const actions = [
    { id: "A001", risk: "PS001", description: "Implementar sistema de priorização de tarefas", responsible: "Maria Silva (RH)", deadline: "15/06/2025", status: "Não iniciada", priority: "Alta" },
    { id: "A002", risk: "PS001", description: "Realizar reuniões semanais com equipe", responsible: "Carlos Mendes (Supervisor)", deadline: "01/06/2025", status: "Em andamento", priority: "Média" },
    { id: "A003", risk: "PS001", description: "Implementar pausas obrigatórias no sistema", responsible: "Joana Lima (TI)", deadline: "30/06/2025", status: "Não iniciada", priority: "Alta" },
    { id: "A004", risk: "PS002", description: "Treinamento sobre assédio moral", responsible: "Maria Silva (RH)", deadline: "20/05/2025", status: "Concluída", priority: "Alta" },
    { id: "A005", risk: "ER001", description: "Ajustar ergonomia dos postos de trabalho", responsible: "João Pereira (SESMT)", deadline: "10/06/2025", status: "Em andamento", priority: "Média" },
    { id: "A006", risk: "AC001", description: "Instalar fitas antiderrapantes na escada", responsible: "Carlos Santos (Segurança)", deadline: "05/05/2025", status: "Concluída", priority: "Alta" },
  ];
  
  const statusOptions = [
    { value: "all", label: "Todos os status" },
    { value: "Não iniciada", label: "Não iniciada" },
    { value: "Em andamento", label: "Em andamento" },
    { value: "Concluída", label: "Concluída" },
    { value: "Atrasada", label: "Atrasada" },
    { value: "Cancelada", label: "Cancelada" },
  ];
  
  const filteredActions = actions.filter(action => {
    const matchesStatus = statusFilter === "all" || action.status === statusFilter;
    const matchesSearch = search === "" || 
      action.description.toLowerCase().includes(search.toLowerCase()) ||
      action.id.toLowerCase().includes(search.toLowerCase()) ||
      action.responsible.toLowerCase().includes(search.toLowerCase()) ||
      action.risk.toLowerCase().includes(search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "success";
      case "Em andamento":
        return "warning";
      case "Não iniciada":
        return "secondary";
      case "Atrasada":
        return "destructive";
      case "Cancelada":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "destructive";
      case "Média":
        return "warning";
      case "Baixa":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Plano de Ação</CardTitle>
          <div className="flex space-x-2">
            <div className="w-[200px]">
              <SearchableSelect
                options={statusOptions}
                value={statusFilter}
                onValueChange={setStatusFilter}
                placeholder="Filtrar por status"
              />
            </div>
            <div className="w-[250px]">
              <Input
                placeholder="Buscar ação..."
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
              <TableHead>Risco</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">{action.id}</TableCell>
                <TableCell>{action.risk}</TableCell>
                <TableCell>{action.description}</TableCell>
                <TableCell>{action.responsible}</TableCell>
                <TableCell>{action.deadline}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(action.priority) as any}>
                    {action.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(action.status) as any}>
                    {action.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
