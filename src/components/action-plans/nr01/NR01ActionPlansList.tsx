
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { NR01ActionPlan } from '@/hooks/action-plans/useNR01ActionPlans';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface NR01ActionPlansListProps {
  actionPlans: NR01ActionPlan[];
  onPlanSelect?: (plan: NR01ActionPlan) => void;
  onCreateFromRisk?: (riskAnalysis: any) => void;
}

const ITEMS_PER_PAGE = 10;

export function NR01ActionPlansList({ actionPlans, onPlanSelect, onCreateFromRisk }: NR01ActionPlansListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(actionPlans.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPlans = actionPlans.slice(startIndex, endIndex);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Planos de Ação NR-01</CardTitle>
        <Button onClick={() => onCreateFromRisk && onCreateFromRisk(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano de Ação
        </Button>
      </CardHeader>
      <CardContent>
        {actionPlans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum plano de ação encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
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

                    <div className="flex flex-col items-end gap-2">
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
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPlanSelect && onPlanSelect(plan)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar plano"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Excluir plano"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Página {currentPage} de {totalPages} ({actionPlans.length} planos no total)
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
