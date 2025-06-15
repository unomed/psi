
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NR01ActionPlan } from '@/hooks/action-plans/useNR01ActionPlans';

interface NR01ActionPlansListProps {
  actionPlans: NR01ActionPlan[];
  onPlanSelect?: (plan: NR01ActionPlan) => void;
}

export function NR01ActionPlansList({ actionPlans, onPlanSelect }: NR01ActionPlansListProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critico': return 'destructive';
      case 'alto': return 'destructive';
      case 'medio': return 'default';
      case 'baixo': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case 'critico': return 'Crítico';
      case 'alto': return 'Alto';
      case 'medio': return 'Médio';
      case 'baixo': return 'Baixo';
      default: return level;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'active': return 'secondary';
      case 'draft': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos de Ação NR-01</CardTitle>
      </CardHeader>
      <CardContent>
        {actionPlans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum plano de ação encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {actionPlans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onPlanSelect && onPlanSelect(plan)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{plan.title}</h3>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3">
                      {plan.risk_level && (
                        <Badge variant={getRiskLevelColor(plan.risk_level) as any}>
                          {getRiskLevelLabel(plan.risk_level)}
                        </Badge>
                      )}
                      <Badge variant={getStatusColor(plan.status) as any}>
                        {getStatusLabel(plan.status)}
                      </Badge>
                      {plan.sector_name && (
                        <Badge variant="outline">{plan.sector_name}</Badge>
                      )}
                    </div>

                    {plan.risk_analysis && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Categoria: {plan.risk_analysis.category} | 
                        Score: {plan.risk_analysis.risk_score} | 
                        Avaliação: {new Date(plan.risk_analysis.evaluation_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Progresso: {plan.progress_percentage}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${plan.progress_percentage}%` }}
                      />
                    </div>
                    {plan.due_date && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Prazo: {new Date(plan.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
