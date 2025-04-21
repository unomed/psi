
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListChecks, Download, Calendar, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// Tipos para a tabela de ações
type Action = {
  id: string;
  description: string;
  responsible: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "canceled";
  riskId?: string;
  riskDescription?: string;
};

export default function PlanoAcao() {
  const [selectedTab, setSelectedTab] = useState("pendentes");
  const [selectedFilters, setSelectedFilters] = useState({
    department: "all",
    responsibles: "all",
    priority: "all"
  });

  // Mock data para a tabela de ações
  const actions: Action[] = [
    {
      id: "ACT001",
      description: "Implementar sistema de priorização de tarefas no setor de atendimento",
      responsible: "Maria Silva (RH)",
      dueDate: "15/06/2025",
      status: "in_progress",
      riskId: "PS001",
      riskDescription: "Sobrecarga de trabalho no setor de atendimento"
    },
    {
      id: "ACT002",
      description: "Realizar reuniões semanais com equipe para distribuição de demandas",
      responsible: "Carlos Mendes (Supervisor)",
      dueDate: "01/06/2025",
      status: "completed",
      riskId: "PS001",
      riskDescription: "Sobrecarga de trabalho no setor de atendimento"
    },
    {
      id: "ACT003",
      description: "Implementar pausas obrigatórias no sistema de atendimento",
      responsible: "Joana Lima (TI)",
      dueDate: "30/06/2025",
      status: "pending",
      riskId: "PS001",
      riskDescription: "Sobrecarga de trabalho no setor de atendimento"
    },
    {
      id: "ACT004",
      description: "Programa de desenvolvimento de lideranças",
      responsible: "João Pereira (SESMT)",
      dueDate: "30/07/2025",
      status: "in_progress",
      riskId: "PS003",
      riskDescription: "Assédio moral na equipe de vendas"
    },
    {
      id: "ACT005",
      description: "Reavaliação de funções com baixa autonomia",
      responsible: "Ana Oliveira (Produção)",
      dueDate: "15/08/2025",
      status: "pending",
      riskId: "PS007",
      riskDescription: "Falta de autonomia na equipe de produção"
    }
  ];

  // Filtrar ações com base na guia selecionada
  const getFilteredActions = () => {
    switch (selectedTab) {
      case "pendentes":
        return actions.filter(action => action.status === "pending");
      case "progresso":
        return actions.filter(action => action.status === "in_progress");
      case "concluidas":
        return actions.filter(action => action.status === "completed");
      case "atrasadas":
        // Para este exemplo, consideramos como atrasadas as ações pendentes com data de vencimento anterior à atual
        const today = new Date();
        return actions.filter(action => {
          const dueDate = new Date(action.dueDate.split('/').reverse().join('-'));
          return (action.status === "pending" || action.status === "in_progress") && dueDate < today;
        });
      default:
        return actions;
    }
  };

  // Renderização de status com cores
  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Pendente</span>;
      case "in_progress":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Em andamento</span>;
      case "completed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Concluída</span>;
      case "canceled":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Cancelada</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  // Definição das colunas da tabela
  const columns: ColumnDef<Action>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "description",
      header: "Descrição da Ação",
    },
    {
      accessorKey: "responsible",
      header: "Responsável",
    },
    {
      accessorKey: "dueDate",
      header: "Prazo",
    },
    {
      accessorKey: "riskId",
      header: "Risco",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{row.original.riskId}</span>
          <span className="text-xs text-muted-foreground">{row.original.riskDescription}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => renderStatus(row.original.status),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleUpdateStatus(row.original.id)}
          >
            Atualizar
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleViewDetails(row.original.id)}
          >
            Detalhes
          </Button>
        </div>
      ),
    },
  ];

  // Handlers para ações nos botões
  const handleUpdateStatus = (actionId: string) => {
    toast.info(`Atualizar status da ação ${actionId}`);
  };

  const handleViewDetails = (actionId: string) => {
    toast.info(`Ver detalhes da ação ${actionId}`);
  };

  const handleNewAction = () => {
    toast.info("Criar nova ação");
  };

  const handleExportPlan = () => {
    toast.info("Exportar plano de ação");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plano de Ação</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de ações para controle de riscos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPlan}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleNewAction}>
            <ListChecks className="mr-2 h-4 w-4" />
            Nova Ação
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departamento</label>
              <select 
                className="border p-2 w-full rounded"
                value={selectedFilters.department}
                onChange={(e) => setSelectedFilters({...selectedFilters, department: e.target.value})}
              >
                <option value="all">Todos</option>
                <option value="atendimento">Atendimento</option>
                <option value="vendas">Vendas</option>
                <option value="producao">Produção</option>
                <option value="rh">Recursos Humanos</option>
                <option value="ti">TI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Responsável</label>
              <select 
                className="border p-2 w-full rounded"
                value={selectedFilters.responsibles}
                onChange={(e) => setSelectedFilters({...selectedFilters, responsibles: e.target.value})}
              >
                <option value="all">Todos</option>
                <option value="maria">Maria Silva (RH)</option>
                <option value="joao">João Pereira (SESMT)</option>
                <option value="carlos">Carlos Mendes (Supervisor)</option>
                <option value="joana">Joana Lima (TI)</option>
                <option value="ana">Ana Oliveira (Produção)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select 
                className="border p-2 w-full rounded"
                value={selectedFilters.priority}
                onChange={(e) => setSelectedFilters({...selectedFilters, priority: e.target.value})}
              >
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2">
              <Filter className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="ghost">Limpar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs e tabela */}
      <Card>
        <CardHeader>
          <Tabs defaultValue="pendentes" onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList>
              <TabsTrigger value="pendentes">
                Pendentes <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">
                  {actions.filter(action => action.status === "pending").length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="progresso">
                Em Progresso <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {actions.filter(action => action.status === "in_progress").length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="concluidas">
                Concluídas <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                  {actions.filter(action => action.status === "completed").length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="atrasadas">
                Atrasadas <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                  {actions.filter(action => {
                    const dueDate = new Date(action.dueDate.split('/').reverse().join('-'));
                    return (action.status === "pending" || action.status === "in_progress") && dueDate < new Date();
                  }).length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pendentes" className="mt-4">
              <DataTable 
                columns={columns} 
                data={getFilteredActions()} 
              />
            </TabsContent>
            
            <TabsContent value="progresso" className="mt-4">
              <DataTable 
                columns={columns} 
                data={getFilteredActions()} 
              />
            </TabsContent>
            
            <TabsContent value="concluidas" className="mt-4">
              <DataTable 
                columns={columns} 
                data={getFilteredActions()} 
              />
            </TabsContent>
            
            <TabsContent value="atrasadas" className="mt-4">
              <DataTable 
                columns={columns} 
                data={getFilteredActions()} 
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Formulário para nova ação */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição da Ação *</label>
              <Textarea placeholder="Descreva a ação a ser realizada" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Risco Relacionado</label>
                <select className="border p-2 w-full rounded">
                  <option value="">Selecione um risco...</option>
                  <option value="PS001">PS001 - Sobrecarga de trabalho no setor de atendimento</option>
                  <option value="PS003">PS003 - Assédio moral na equipe de vendas</option>
                  <option value="PS007">PS007 - Falta de autonomia na equipe de produção</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departamento *</label>
                <select className="border p-2 w-full rounded">
                  <option value="">Selecione um departamento...</option>
                  <option value="atendimento">Atendimento</option>
                  <option value="vendas">Vendas</option>
                  <option value="producao">Produção</option>
                  <option value="rh">Recursos Humanos</option>
                  <option value="ti">TI</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Responsável *</label>
                <select className="border p-2 w-full rounded">
                  <option value="">Selecione um responsável...</option>
                  <option value="maria">Maria Silva (RH)</option>
                  <option value="joao">João Pereira (SESMT)</option>
                  <option value="carlos">Carlos Mendes (Supervisor)</option>
                  <option value="joana">Joana Lima (TI)</option>
                  <option value="ana">Ana Oliveira (Produção)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prazo *</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prioridade</label>
                <select className="border p-2 w-full rounded">
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Detalhamento da Ação</label>
              <Textarea 
                className="h-24" 
                placeholder="Forneça mais detalhes sobre como a ação deve ser implementada, recursos necessários, etc."
              />
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2">Cancelar</Button>
              <Button>Salvar Ação</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
