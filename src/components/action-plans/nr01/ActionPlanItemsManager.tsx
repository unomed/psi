
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Calendar, User, Clock } from 'lucide-react';
import { useActionPlanItems } from '@/hooks/useActionPlanItems';
import { NR01ActionPlan } from '@/hooks/action-plans/useNR01ActionPlans';

interface ActionPlanItemsManagerProps {
  actionPlan: NR01ActionPlan;
  onAddItem?: () => void;
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

export function ActionPlanItemsManager({
  actionPlan,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: ActionPlanItemsManagerProps) {
  const { items, isLoading } = useActionPlanItems(actionPlan.id);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const calculateOverallProgress = () => {
    if (!items || items.length === 0) return 0;
    const totalProgress = items.reduce((sum, item) => sum + item.progress_percentage, 0);
    return Math.round(totalProgress / items.length);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Itens do Plano de Ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Itens do Plano de Ação</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm text-muted-foreground">
              {items?.length || 0} item(s) • Progresso geral: {calculateOverallProgress()}%
            </div>
            <Progress value={calculateOverallProgress()} className="w-32" />
          </div>
        </div>
        <Button onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </CardHeader>
      <CardContent>
        {!items || items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum item adicionado ao plano de ação ainda.
            </p>
            <Button onClick={onAddItem} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge variant={getStatusColor(item.status) as any}>
                        {getStatusLabel(item.status)}
                      </Badge>
                      <Badge variant={getPriorityColor(item.priority) as any}>
                        {item.priority}
                      </Badge>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {item.responsible_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>Responsável: {item.responsible_name}</span>
                        </div>
                      )}
                      
                      {item.estimated_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>Estimativa: {item.estimated_hours}h</span>
                        </div>
                      )}
                      
                      {item.due_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Prazo: {new Date(item.due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          Progresso: {item.progress_percentage}%
                        </span>
                      </div>
                      <Progress value={item.progress_percentage} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditItem && onEditItem(item.id)}
                      title="Editar item"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteItem && onDeleteItem(item.id)}
                      title="Excluir item"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
