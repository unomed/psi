
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, BarChart3, AlertTriangle } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useNR01ActionPlans } from '@/hooks/action-plans/useNR01ActionPlans';
import { usePsychosocialRiskData } from '@/hooks/action-plans/usePsychosocialRiskData';
import { useSectors } from '@/hooks/sectors/useSectors';
import { useAuth } from '@/contexts/AuthContext';
import { ActionPlan } from '@/hooks/useActionPlans';
import { DateRange } from 'react-day-picker';

interface NR01ActionPlansFilterProps {
  actionPlans?: ActionPlan[];
  onPlanSelect?: (plan: ActionPlan) => void;
}

export function NR01ActionPlansFilter({ onPlanSelect }: NR01ActionPlansFilterProps) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    sector: 'all',
    status: 'all',
    dateRange: undefined as DateRange | undefined
  });

  const { actionPlans, isLoading } = useNR01ActionPlans(filters);
  const { riskStats, isLoading: isLoadingStats } = usePsychosocialRiskData();
  const { sectors } = useSectors({ companyId });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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

  return (
    <div className="space-y-6">
      {/* Estatísticas de Risco */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total de Análises</p>
                <p className="text-2xl font-bold">{riskStats.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Riscos Críticos</p>
                <p className="text-2xl font-bold text-red-600">{riskStats.riskLevels.critico}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Riscos Altos</p>
                <p className="text-2xl font-bold text-orange-600">{riskStats.riskLevels.alto}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Planos Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {actionPlans.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros NR-01
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nível de Risco</label>
              <Select value={filters.riskLevel} onValueChange={(value) => handleFilterChange('riskLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="critico">Crítico ({riskStats.riskLevels.critico})</SelectItem>
                  <SelectItem value="alto">Alto ({riskStats.riskLevels.alto})</SelectItem>
                  <SelectItem value="medio">Médio ({riskStats.riskLevels.medio})</SelectItem>
                  <SelectItem value="baixo">Baixo ({riskStats.riskLevels.baixo})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Setor</label>
              <Select value={filters.sector} onValueChange={(value) => handleFilterChange('sector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={(dateRange) => handleFilterChange('dateRange', dateRange)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({
                riskLevel: 'all',
                sector: 'all',
                status: 'all',
                dateRange: undefined
              })}
            >
              Limpar Filtros
            </Button>
            <span className="text-sm text-muted-foreground">
              {actionPlans.length} plano(s) encontrado(s)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Planos de Ação */}
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
    </div>
  );
}
