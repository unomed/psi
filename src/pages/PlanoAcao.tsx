import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Search, Download, BarChart3, Users, AlertTriangle, CheckCircle2, Target, TrendingUp, Calendar, FileText, Building, DollarSign, Clock, Settings, User, MapPin, Briefcase, PieChart, Activity, Zap } from "lucide-react";
import { ActionPlanForm } from "@/components/action-plans/ActionPlanForm";
import { ActionPlansList } from "@/components/action-plans/ActionPlansList";
import { ActionPlansTable } from "@/components/action-plans/ActionPlansTable";
import { NR01ActionPlansFilter } from "@/components/action-plans/NR01ActionPlansFilter";
import { NR01ActionPlansList } from "@/components/action-plans/nr01/NR01ActionPlansList";
import { NR01RiskStatistics } from "@/components/action-plans/nr01/NR01RiskStatistics";
import { CreateActionPlanDialog } from "@/components/action-plans/nr01/CreateActionPlanDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";

import { useActionPlans } from "@/hooks/useActionPlans";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";

import type { ActionPlan, CreateActionPlan } from "@/types/action-plan";
import type { Company } from "@/types/company";
import type { Sector } from "@/types/sector";
import type { Role } from "@/types/role";
import type { Employee } from "@/types/employee";

export default function PlanoAcao() {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedActionPlan, setSelectedActionPlan] = useState<ActionPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>("open");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

  const { actionPlans, isLoading, error, createActionPlan, updateActionPlan, deleteActionPlan } = useActionPlans();
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { roles } = useRoles();
  const { employees } = useEmployees({});
  const { user } = useAuth();

  const filteredActionPlans = actionPlans?.filter(plan => {
    const searchMatch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const companyMatch = selectedCompany ? plan.company_id === selectedCompany : true;
    const sectorMatch = selectedSector ? plan.sector_id === selectedSector : true;
    const roleMatch = selectedRole ? plan.role_id === selectedRole : true;
    const employeeMatch = selectedEmployee ? plan.employee_id === selectedEmployee : true;
    const statusMatch = selectedStatus === "all" ? true : plan.status === selectedStatus;

    return searchMatch && companyMatch && sectorMatch && roleMatch && employeeMatch && statusMatch;
  });

  const handleCreateActionPlan = async (actionPlan: CreateActionPlan) => {
    try {
      await createActionPlan(actionPlan);
      toast.success("Plano de ação criado com sucesso!");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast.error(`Erro ao criar plano de ação: ${err}`);
    }
  };

  const handleUpdateActionPlan = async (actionPlan: ActionPlan) => {
    if (!actionPlan.id) {
      toast.error("ID do plano de ação inválido.");
      return;
    }
    try {
      await updateActionPlan(actionPlan);
      toast.success("Plano de ação atualizado com sucesso!");
      setIsFormDialogOpen(false);
    } catch (err) {
      toast.error(`Erro ao atualizar plano de ação: ${err}`);
    }
  };

  const handleDeleteActionPlan = async (id: string) => {
    try {
      await deleteActionPlan(id);
      toast.success("Plano de ação excluído com sucesso!");
    } catch (err) {
      toast.error(`Erro ao excluir plano de ação: ${err}`);
    }
  };

  const mockActionPlansListProps = {
    onCreatePlan: () => setIsCreateDialogOpen(true),
    onEditPlan: (plan: ActionPlan) => {
      setSelectedActionPlan(plan);
      setIsFormDialogOpen(true);
    },
    onViewDetails: (plan: ActionPlan) => {
      console.log('Viewing plan details:', plan);
    }
  };

  return (
    <div className="w-full max-w-none p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos de Ação</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe os planos de ação para garantir a segurança e o bem-estar dos funcionários
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano de Ação
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="list">
            <FileText className="h-4 w-4 mr-2" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="nr01">
            <AlertTriangle className="h-4 w-4 mr-2" />
            NR-01
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Planos de Ação Abertos
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  Planos de ação em andamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Planos de Ação Concluídos
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Planos de ação finalizados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Planos
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  Todos os planos de ação
                </p>
              </CardContent>
            </Card>
          </div>

          <ActionPlansList {...mockActionPlansListProps} />
        </TabsContent>

        <TabsContent value="list" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Buscar plano de ação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por Empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todas as Empresas</SelectItem>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedSector}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos os Setores</SelectItem>
                  {sectors?.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todas as Funções</SelectItem>
                  {roles?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por Funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos os Funcionários</SelectItem>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="open">Abertos</SelectItem>
                  <SelectItem value="closed">Concluídos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ActionPlansTable
            actionPlans={filteredActionPlans}
            onEdit={plan => {
              setSelectedActionPlan(plan);
              setIsFormDialogOpen(true);
            }}
            onDelete={handleDeleteActionPlan}
          />
        </TabsContent>

        <TabsContent value="nr01" className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NR01RiskStatistics />
            <NR01ActionPlansFilter />
          </div>
          <NR01ActionPlansList />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedActionPlan ? "Editar Plano de Ação" : "Novo Plano de Ação"}</DialogTitle>
            <DialogDescription>
              {selectedActionPlan ? "Edite os detalhes do plano de ação." : "Crie um novo plano de ação para a empresa."}
            </DialogDescription>
          </DialogHeader>
          <ActionPlanForm
            actionPlan={selectedActionPlan}
            onSubmit={handleUpdateActionPlan}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <CreateActionPlanDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateActionPlan}
      />
    </div>
  );
}
