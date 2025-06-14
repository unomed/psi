
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionPlansList } from '@/components/action-plans/ActionPlansList';
import { NR01ActionPlansFilter } from '@/components/action-plans/NR01ActionPlansFilter';
import { useActionPlans } from '@/hooks/useActionPlans';
import { Brain, List } from 'lucide-react';

export default function PlanoAcao() {
  const { actionPlans } = useActionPlans();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    // Aqui você pode navegar para detalhes do plano ou abrir modal
    console.log('Selected plan:', plan);
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nr01" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Planos NR-01
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Todos os Planos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nr01">
          <NR01ActionPlansFilter 
            actionPlans={actionPlans} 
            onPlanSelect={handlePlanSelect}
          />
        </TabsContent>

        <TabsContent value="all">
          <ActionPlansList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
