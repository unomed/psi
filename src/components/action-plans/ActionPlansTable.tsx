
import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Eye, Edit, Trash2, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionPlan, useActionPlans } from '@/hooks/useActionPlans';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActionPlansTableProps {
  onView?: (plan: ActionPlan) => void;
  onEdit?: (plan: ActionPlan) => void;
  onDelete?: (plan: ActionPlan) => void;
}

export function ActionPlansTable({ onView, onEdit, onDelete }: ActionPlansTableProps) {
  const { actionPlans, isLoading } = useActionPlans();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'active':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'active':
        return 'Ativo';
      case 'draft':
        return 'Rascunho';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'Crítica';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const columns: ColumnDef<ActionPlan>[] = [
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue('title')}</div>
          {row.original.description && (
            <div className="text-sm text-muted-foreground truncate">
              {row.original.description}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue('status'))}>
          {getStatusLabel(row.getValue('status'))}
        </Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Prioridade',
      cell: ({ row }) => (
        <Badge variant={getPriorityVariant(row.getValue('priority'))}>
          {getPriorityLabel(row.getValue('priority'))}
        </Badge>
      ),
    },
    {
      accessorKey: 'sector_name',
      header: 'Setor',
      cell: ({ row }) => row.getValue('sector_name') || '-',
    },
    {
      accessorKey: 'start_date',
      header: 'Data Início',
      cell: ({ row }) => formatDate(row.getValue('start_date')),
    },
    {
      accessorKey: 'due_date',
      header: 'Data Prazo',
      cell: ({ row }) => formatDate(row.getValue('due_date')),
    },
    {
      accessorKey: 'progress_percentage',
      header: 'Progresso',
      cell: ({ row }) => {
        const progress = row.getValue('progress_percentage') as number;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm">{progress}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'budget_allocated',
      header: 'Orçamento',
      cell: ({ row }) => {
        const budget = row.getValue('budget_allocated') as number;
        return budget ? `R$ ${budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const plan = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(plan)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(plan)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(plan)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredPlans = actionPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.sector_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
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

      <DataTable
        columns={columns}
        data={filteredPlans}
        isLoading={isLoading}
      />
    </div>
  );
}
