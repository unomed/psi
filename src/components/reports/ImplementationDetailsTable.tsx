
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

interface ImplementationDetailsTableProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ImplementationDetailsTable({ filters }: ImplementationDetailsTableProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const actions = [
    { 
      id: "A001", 
      risk: "PS001", 
      description: "Implementar sistema de priorização de tarefas", 
      responsible: "Maria Silva (RH)", 
      deadline: "15/06/2025", 
      status: "Não iniciada", 
      progress: 0,
      comments: "Aguardando aprovação da diretoria"
    },
    { 
      id: "A002", 
      risk: "PS001", 
      description: "Realizar reuniões semanais com equipe", 
      responsible: "Carlos Mendes (Supervisor)", 
      deadline: "01/06/2025", 
      status: "Em andamento", 
      progress: 50,
      comments: "Primeira reunião realizada em 15/04. Feedback positivo."
    },
    { 
      id: "A003", 
      risk: "PS001", 
      description: "Implementar pausas obrigatórias no sistema", 
      responsible: "Joana Lima (TI)", 
      deadline: "30/06/2025", 
      status: "Não iniciada", 
      progress: 0,
      comments: "Pendente de priorização pelo time de desenvolvimento"
    },
    { 
      id: "A004", 
      risk: "PS002", 
      description: "Treinamento sobre assédio moral", 
      responsible: "Maria Silva (RH)", 
      deadline: "20/05/2025", 
      status: "Concluída", 
      progress: 100,
      comments: "Treinamento realizado em 18/04 com 95% de participação"
    },
    { 
      id: "A005", 
      risk: "ER001", 
      description: "Ajustar ergonomia dos postos de trabalho", 
      responsible: "João Pereira (SESMT)", 
      deadline: "10/06/2025", 
      status: "Em andamento", 
      progress: 30,
      comments: "Cadeiras ergonômicas adquiridas. Falta instalar suportes de monitor."
    },
    { 
      id: "A006", 
      risk: "AC001", 
      description: "Instalar fitas antiderrapantes na escada", 
      responsible: "Carlos Santos (Segurança)", 
      deadline: "05/05/2025", 
      status: "Concluída", 
      progress: 100,
      comments: "Instalação finalizada em 01/05. Verificação de segurança realizada."
    },
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
      action.risk.toLowerCase().includes(search.toLowerCase()) ||
      action.comments.toLowerCase().includes(search.toLowerCase());
    
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Detalhes de Implementação</CardTitle>
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
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Comentários</TableHead>
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
                  <Badge variant={getStatusColor(action.status) as any}>
                    {action.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${action.progress === 100 ? 'bg-green-600' : 'bg-blue-600'}`} 
                      style={{ width: `${action.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">{action.progress}%</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={action.comments}>
                    {action.comments}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
