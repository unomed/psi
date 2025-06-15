
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface NR01FiltersSectionProps {
  filters: {
    riskLevel: string;
    sector: string;
    status: string;
    dateRange: DateRange | undefined;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  riskStats: {
    riskLevels: {
      baixo: number;
      medio: number;
      alto: number;
      critico: number;
    };
  };
  sectors: Array<{ id: string; name: string }>;
  resultCount: number;
}

export function NR01FiltersSection({
  filters,
  onFilterChange,
  onClearFilters,
  riskStats,
  sectors,
  resultCount
}: NR01FiltersSectionProps) {
  return (
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
            <Select value={filters.riskLevel} onValueChange={(value) => onFilterChange('riskLevel', value)}>
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
            <Select value={filters.sector} onValueChange={(value) => onFilterChange('sector', value)}>
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
            <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
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
              onDateChange={(dateRange) => onFilterChange('dateRange', dateRange)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpar Filtros
          </Button>
          <span className="text-sm text-muted-foreground">
            {resultCount} plano(s) encontrado(s)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
