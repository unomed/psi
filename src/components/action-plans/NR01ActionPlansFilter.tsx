import React, { useState } from 'react';
import { useNR01ActionPlans, NR01ActionPlan } from '@/hooks/action-plans/useNR01ActionPlans';
import { usePsychosocialRiskData } from '@/hooks/action-plans/usePsychosocialRiskData';
import { useSectors } from '@/hooks/sectors/useSectors';
import { useActionPlans } from '@/hooks/useActionPlans';
import { useAuth } from '@/hooks/useAuth';
import { DateRange } from 'react-day-picker';
import { NR01RiskStatistics } from './nr01/NR01RiskStatistics';
import { NR01FiltersSection } from './nr01/NR01FiltersSection';
import { NR01ActionPlansList } from './nr01/NR01ActionPlansList';
import { CreateActionPlanDialog } from './nr01/CreateActionPlanDialog';
import { ActionPlanItemsManager } from './nr01/ActionPlanItemsManager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface NR01ActionPlansFilterProps {
  onPlanSelect?: (plan: NR01ActionPlan) => void;
}

export function NR01ActionPlansFilter({ onPlanSelect }: NR01ActionPlansFilterProps) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  const { createActionPlan } = useActionPlans();
  
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    sector: 'all',
    status: 'all',
    dateRange: undefined as DateRange | undefined
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPlanForItems, setSelectedPlanForItems] = useState<NR01ActionPlan | null>(null);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);

  const { actionPlans, isLoading } = useNR01ActionPlans(filters);
  const { riskStats, isLoading: isLoadingStats } = usePsychosocialRiskData();
  const { sectors } = useSectors({ companyId });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      riskLevel: 'all',
      sector: 'all',
      status: 'all',
      dateRange: undefined
    });
  };

  const handleCreatePlan = async (planData: any) => {
    try {
      await createActionPlan.mutateAsync(planData);
      toast.success('Plano de ação criado com sucesso!');
    } catch (error) {
      console.error('Error creating action plan:', error);
      toast.error('Erro ao criar plano de ação');
    }
  };

  const handlePlanSelect = (plan: NR01ActionPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    } else {
      // Open items manager dialog
      setSelectedPlanForItems(plan);
      setItemsDialogOpen(true);
    }
  };

  if (isLoading || isLoadingStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const activePlansCount = actionPlans.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      <NR01RiskStatistics 
        riskStats={riskStats} 
        activePlansCount={activePlansCount} 
      />
      
      <NR01FiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        riskStats={riskStats}
        sectors={sectors}
        resultCount={actionPlans.length}
      />

      <NR01ActionPlansList 
        actionPlans={actionPlans}
        onPlanSelect={handlePlanSelect}
        onCreateFromRisk={() => setCreateDialogOpen(true)}
      />

      <CreateActionPlanDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreatePlan={handleCreatePlan}
      />

      <Dialog open={itemsDialogOpen} onOpenChange={setItemsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Gerenciar Itens - {selectedPlanForItems?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedPlanForItems && (
            <ActionPlanItemsManager
              actionPlan={selectedPlanForItems}
              onAddItem={() => {
                toast.info('Funcionalidade de adicionar item será implementada em breve');
              }}
              onEditItem={(itemId) => {
                toast.info(`Editar item ${itemId} será implementado em breve`);
              }}
              onDeleteItem={(itemId) => {
                toast.info(`Excluir item ${itemId} será implementado em breve`);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
