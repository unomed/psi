
import React, { useState } from 'react';
import { ActionPlanCard } from './ActionPlanCard';
import { ActionPlanForm } from './ActionPlanForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Search } from 'lucide-react';
import { useActionPlans, ActionPlan } from '@/hooks/useActionPlans';
import { useAuth } from '@/contexts/AuthContext';

export function ActionPlansList() {
  const { actionPlans, isLoading, createActionPlan, updateActionPlan, deleteActionPlan } = useActionPlans();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(null);

  const filteredPlans = actionPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePlan = (data: any) => {
    createActionPlan.mutate({
      ...data,
      created_by: user?.id,
    }, {
      onSuccess: () => {
        setDialogOpen(false);
        setSelectedPlan(null);
      }
    });
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

  const handleEdit = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleDelete = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
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

  const handleView = (plan: ActionPlan) => {
    // TODO: Navigate to plan details page
    console.log('View plan:', plan);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Planos de Ação</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planos de Ação</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar planos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum plano de ação encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro plano de ação'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Plano
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <ActionPlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? 'Editar Plano de Ação' : 'Novo Plano de Ação'}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan 
                ? 'Edite as informações do plano de ação.' 
                : 'Crie um novo plano de ação preenchendo as informações abaixo.'
              }
            </DialogDescription>
          </DialogHeader>
          <ActionPlanForm
            plan={selectedPlan || undefined}
            onSubmit={selectedPlan ? handleUpdatePlan : handleCreatePlan}
            onCancel={() => {
              setDialogOpen(false);
              setSelectedPlan(null);
            }}
            isLoading={createActionPlan.isPending || updateActionPlan.isPending}
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
