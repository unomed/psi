
import React, { useState } from 'react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface AuditLogsListProps {
  companyId?: string;
}

const actionTypeLabels: Record<string, string> = {
  create: 'Criar',
  read: 'Visualizar',
  update: 'Atualizar',
  delete: 'Excluir',
  login: 'Login',
  logout: 'Logout',
  export: 'Exportar',
  import: 'Importar',
  email_send: 'Envio Email',
  permission_change: 'Alterar Permissão',
  assessment_complete: 'Avaliação Completa',
  report_generate: 'Gerar Relatório'
};

const moduleLabels: Record<string, string> = {
  auth: 'Autenticação',
  companies: 'Empresas',
  employees: 'Funcionários',
  roles: 'Funções',
  sectors: 'Setores',
  assessments: 'Avaliações',
  reports: 'Relatórios',
  billing: 'Faturamento',
  settings: 'Configurações',
  risks: 'Riscos'
};

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-800',
  read: 'bg-blue-100 text-blue-800',
  update: 'bg-yellow-100 text-yellow-800',
  delete: 'bg-red-100 text-red-800',
  login: 'bg-purple-100 text-purple-800',
  logout: 'bg-gray-100 text-gray-800',
  export: 'bg-indigo-100 text-indigo-800',
  import: 'bg-cyan-100 text-cyan-800',
  email_send: 'bg-pink-100 text-pink-800',
  permission_change: 'bg-orange-100 text-orange-800',
  assessment_complete: 'bg-emerald-100 text-emerald-800',
  report_generate: 'bg-violet-100 text-violet-800'
};

// Helper function to safely get user name from profiles
const getUserName = (profiles: any): string => {
  if (!profiles) return 'Sistema';
  if (typeof profiles === 'object' && profiles.full_name) {
    return profiles.full_name;
  }
  return 'Sistema';
};

export function AuditLogsList({ companyId }: AuditLogsListProps) {
  const [filters, setFilters] = useState({
    module: '',
    action: '',
    dateFrom: '',
    dateTo: '',
    search: '',
    companyId
  });

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const { data: logs, isLoading, error } = useAuditLogs(filters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    setFilters(prev => ({ 
      ...prev, 
      dateFrom: date ? format(date, 'yyyy-MM-dd') : '' 
    }));
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    setFilters(prev => ({ 
      ...prev, 
      dateTo: date ? format(date, 'yyyy-MM-dd') : '' 
    }));
  };

  const clearFilters = () => {
    setFilters({
      module: '',
      action: '',
      dateFrom: '',
      dateTo: '',
      search: '',
      companyId
    });
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const exportLogs = () => {
    if (!logs) return;
    
    const csv = [
      ['Data/Hora', 'Usuário', 'Ação', 'Módulo', 'Descrição', 'Empresa'].join(','),
      ...logs.map(log => [
        format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss'),
        getUserName(log.profiles),
        actionTypeLabels[log.action_type] || log.action_type,
        moduleLabels[log.module] || log.module,
        log.description,
        log.companies?.name || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-red-600">
            Erro ao carregar logs de auditoria: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Logs de Auditoria</CardTitle>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <Input
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          
          <Select value={filters.module} onValueChange={(value) => handleFilterChange('module', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {Object.entries(moduleLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {Object.entries(actionTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal flex-1", !dateTo && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={handleDateToChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={clearFilters} size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {logs?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum log encontrado com os filtros aplicados
            </p>
          ) : (
            logs?.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={actionColors[log.action_type] || 'bg-gray-100 text-gray-800'}>
                      {actionTypeLabels[log.action_type] || log.action_type}
                    </Badge>
                    <Badge variant="outline">
                      {moduleLabels[log.module] || log.module}
                    </Badge>
                    {log.companies?.name && (
                      <Badge variant="secondary">{log.companies.name}</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm">{log.description}</p>
                  <span className="text-sm text-muted-foreground">
                    {getUserName(log.profiles)}
                  </span>
                </div>

                {(log.old_values || log.new_values) && (
                  <div className="text-xs text-muted-foreground border-t pt-2">
                    {log.old_values && (
                      <div>
                        <strong>Valores anteriores:</strong> {JSON.stringify(log.old_values)}
                      </div>
                    )}
                    {log.new_values && (
                      <div>
                        <strong>Novos valores:</strong> {JSON.stringify(log.new_values)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
