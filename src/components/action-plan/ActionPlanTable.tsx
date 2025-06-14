
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Action, ActionStatus } from "@/types/actionPlan";
import { ActionStatusBadge } from "./ActionStatusBadge";

interface ActionPlanTableProps {
  actions: Action[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export function ActionPlanTable({ actions, selectedTab, onTabChange }: ActionPlanTableProps) {
  const handleUpdateStatus = (actionId: string) => {
    toast.info(`Atualizar status da ação ${actionId}`);
  };

  const handleViewDetails = (actionId: string) => {
    toast.info(`Ver detalhes da ação ${actionId}`);
  };

  const getFilteredActions = () => {
    switch (selectedTab) {
      case "pendentes":
        return actions.filter(action => action.status === "pending");
      case "progresso":
        return actions.filter(action => action.status === "in_progress");
      case "concluidas":
        return actions.filter(action => action.status === "completed");
      case "atrasadas":
        const today = new Date();
        return actions.filter(action => {
          const dueDate = new Date(action.dueDate.split('/').reverse().join('-'));
          return (action.status === "pending" || action.status === "in_progress") && dueDate < today;
        });
      default:
        return actions;
    }
  };

  const getActionCount = (status: ActionStatus | "atrasadas") => {
    if (status === "atrasadas") {
      const today = new Date();
      return actions.filter(action => {
        const dueDate = new Date(action.dueDate.split('/').reverse().join('-'));
        return (action.status === "pending" || action.status === "in_progress") && dueDate < today;
      }).length;
    }
    return actions.filter(action => action.status === status).length;
  };

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
      cell: ({ row }) => <ActionStatusBadge status={row.original.status} />,
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

  return (
    <Card>
      <CardHeader>
        <Tabs defaultValue="pendentes" onValueChange={onTabChange} value={selectedTab}>
          <TabsList>
            <TabsTrigger value="pendentes">
              Pendentes <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">
                {getActionCount("pending")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="progresso">
              Em Progresso <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                {getActionCount("in_progress")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="concluidas">
              Concluídas <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                {getActionCount("completed")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="atrasadas">
              Atrasadas <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                {getActionCount("atrasadas")}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="mt-4">
            <DataTable columns={columns} data={getFilteredActions()} />
          </TabsContent>
          
          <TabsContent value="progresso" className="mt-4">
            <DataTable columns={columns} data={getFilteredActions()} />
          </TabsContent>
          
          <TabsContent value="concluidas" className="mt-4">
            <DataTable columns={columns} data={getFilteredActions()} />
          </TabsContent>
          
          <TabsContent value="atrasadas" className="mt-4">
            <DataTable columns={columns} data={getFilteredActions()} />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
