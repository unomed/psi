
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { ActionPlan } from "@/hooks/useActionPlans";

interface NR01ActionPlansFilterProps {
  actionPlans: ActionPlan[];
  onPlanSelect: (plan: ActionPlan) => void;
}

export function NR01ActionPlansFilter({ actionPlans, onPlanSelect }: NR01ActionPlansFilterProps) {
  // Filtrar planos que são originados de NR-01 (título contém "NR-01")
  const nr01Plans = actionPlans.filter(plan => 
    plan.title.includes('NR-01') || plan.description?.includes('psicossocial')
  );

  // Agrupar por prioridade/urgência
  const criticalPlans = nr01Plans.filter(p => p.priority === 'critical');
  const highPlans = nr01Plans.filter(p => p.priority === 'high');
  const mediumPlans = nr01Plans.filter(p => p.priority === 'medium');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (nr01Plans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Planos de Ação NR-01
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum plano de ação NR-01 encontrado</p>
            <p className="text-sm">Planos são gerados automaticamente quando riscos psicossociais altos são identificados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Planos de Ação NR-01
            </div>
            <Badge variant="outline">{nr01Plans.length} planos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{criticalPlans.length}</div>
              <div className="text-sm text-muted-foreground">Críticos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{highPlans.length}</div>
              <div className="text-sm text-muted-foreground">Alta Prioridade</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{mediumPlans.length}</div>
              <div className="text-sm text-muted-foreground">Média Prioridade</div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Planos Críticos */}
            {criticalPlans.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Intervenção Emergencial Necessária
                </h4>
                <div className="space-y-2">
                  {criticalPlans.map((plan) => (
                    <div key={plan.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium">{plan.title}</h5>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {plan.description}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Badge className={getPriorityColor(plan.priority)}>
                            Crítico
                          </Badge>
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status === 'active' ? 'Ativo' : 
                             plan.status === 'completed' ? 'Concluído' :
                             plan.status === 'draft' ? 'Rascunho' : 'Cancelado'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Vencimento: {formatDate(plan.due_date)}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onPlanSelect(plan)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planos de Alta Prioridade */}
            {highPlans.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-600 mb-3">
                  Alta Prioridade
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPlans.map((plan) => (
                    <div key={plan.id} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{plan.title}</h5>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {plan.sector_name || 'Geral'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status === 'active' ? 'Ativo' : 
                           plan.status === 'completed' ? 'Concluído' :
                           plan.status === 'draft' ? 'Rascunho' : 'Cancelado'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(plan.due_date)}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onPlanSelect(plan)}
                        >
                          Abrir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planos de Média Prioridade */}
            {mediumPlans.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-600 mb-3">
                  Média Prioridade
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {mediumPlans.map((plan) => (
                    <div key={plan.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm line-clamp-1">{plan.title}</h5>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : null}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(plan.due_date)}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onPlanSelect(plan)}
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
