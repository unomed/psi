
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import { ActionPlan } from '@/hooks/useActionPlans';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActionPlanCardProps {
  plan: ActionPlan;
  onEdit: (plan: ActionPlan) => void;
  onDelete: (plan: ActionPlan) => void;
  onView: (plan: ActionPlan) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export function ActionPlanCard({ plan, onEdit, onDelete, onView }: ActionPlanCardProps) {
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2">{plan.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusColors[plan.status]}>
                {plan.status === 'draft' ? 'Rascunho' : 
                 plan.status === 'active' ? 'Ativo' :
                 plan.status === 'completed' ? 'Concluído' : 'Cancelado'}
              </Badge>
              <Badge className={priorityColors[plan.priority]}>
                {plan.priority === 'low' ? 'Baixa' :
                 plan.priority === 'medium' ? 'Média' :
                 plan.priority === 'high' ? 'Alta' : 'Crítica'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onView(plan)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(plan)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(plan)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {plan.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plan.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progresso</span>
            <span className="font-medium">{plan.progress_percentage}%</span>
          </div>
          <Progress value={plan.progress_percentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Início</div>
              <div className="font-medium">{formatDate(plan.start_date)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Vencimento</div>
              <div className="font-medium">{formatDate(plan.due_date)}</div>
            </div>
          </div>
        </div>

        {plan.budget_allocated && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-muted-foreground">Orçamento</div>
              <div className="font-medium">
                {formatCurrency(plan.budget_used)} / {formatCurrency(plan.budget_allocated)}
              </div>
            </div>
          </div>
        )}

        {plan.department && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Departamento</div>
              <div className="font-medium">{plan.department}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
