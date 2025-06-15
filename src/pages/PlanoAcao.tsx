
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionPlansList } from '@/components/action-plans/ActionPlansList';
import { ActionPlansTable } from '@/components/action-plans/ActionPlansTable';
import { NR01ActionPlansFilter } from '@/components/action-plans/NR01ActionPlansFilter';
import { NR01ActionPlan } from '@/hooks/action-plans/useNR01ActionPlans';
import { useActionPlans, ActionPlan } from '@/hooks/useActionPlans';
import { Brain, List, Table } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ActionPlanForm } from '@/components/action-plans/ActionPlanForm';
import { useAuth } from '@/contexts/AuthContext';

export default function PlanoAcao() {
  const { actionPlans, updateActionPlan, deleteActionPlan } = useActionPlans();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(null);
  const [selectedNR01Plan, setSelectedNR01Plan] = useState<NR01ActionPlan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleNR01PlanSelect = (plan: NR01ActionPlan) => {
    setSelectedNR01Plan(plan);
    console.log('Selected NR-01 plan:', plan);
    // Implementar navegação para detalhes ou abrir modal de visualização
  };

  const handlePlanSelect = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    console.log('Selected plan:', plan);
    // Implementar navegação para detalhes ou abrir modal de visualização
  };

  const handleView = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    // Implementar modal de visualização ou navegação para página de detalhes
    console.log('View plan:', plan);
  };

  const handleEdit = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleDelete = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const handleUpdatePlan = (data: any) => {
    if (!selectedPlan) return;
    
    updateActionPlan.mutate({
      id: selectedPlan.id,
      ...data,
    }, {
      onSuccess: () => {
        setDialogOpen(false);
        setSelectedPlan(null);
      }
    });
  };

  const confirmDelete = () => {
    if (!selectedPlan) return;
    
    deleteActionPlan.mutate(selectedPlan.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedPlan(null);
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Planos de Ação</h1>
        <p className="text-muted-foreground">
          Gerencie planos de ação gerais e específicos para conformidade NR-01
        </p>
      </div>

      <Tabs defaultValue="nr01" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nr01" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Planos NR-01
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Todos os Planos
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Tabela
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nr01">
          <NR01ActionPlansFilter 
            onPlanSelect={handleNR01PlanSelect}
          />
        </TabsContent>

        <TabsContent value="all">
          <ActionPlansList />
        </TabsContent>

        <TabsContent value="table">
          <ActionPlansTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plano de Ação</DialogTitle>
            <DialogDescription>
              Edite as informações do plano de ação.
            </DialogDescription>
          </DialogHeader>
          <ActionPlanForm
            plan={selectedPlan || undefined}
            onSubmit={handleUpdatePlan}
            onCancel={() => {
              setDialogOpen(false);
              setSelectedPlan(null);
            }}
            isLoading={updateActionPlan.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Plano de Ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o plano "{selectedPlan?.title}"? 
              Esta ação não pode ser desfeita e todos os itens do plano também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteActionPlan.isPending}
            >
              {deleteActionPlan.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
