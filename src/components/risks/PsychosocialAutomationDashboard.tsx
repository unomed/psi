import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

interface PsychosocialAutomationDashboardProps {
  selectedCompanyId: string | null;
}

export function PsychosocialAutomationDashboard({ selectedCompanyId }: PsychosocialAutomationDashboardProps) {
  const { data: processingJobs, isLoading } = useQuery({
    queryKey: ['psychosocial-processing-jobs', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('psychosocial_processing_jobs')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
    refetchInterval: 5000 // Atualizar a cada 5 segundos
  });

  const { data: processingLogs } = useQuery({
    queryKey: ['psychosocial-processing-logs', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('psychosocial_processing_logs')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
    refetchInterval: 10000 // Atualizar a cada 10 segundos
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para ver automação</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Carregando dashboard de automação...</div>;
  }

  const pendingJobs = processingJobs?.filter(job => job.status === 'pending').length || 0;
  const processingCount = processingJobs?.filter(job => job.status === 'processing').length || 0;
  const completedJobs = processingJobs?.filter(job => job.status === 'completed').length || 0;
  const failedJobs = processingJobs?.filter(job => job.status === 'failed').length || 0;

  return (
    <div className="space-y-6">
      {/* Estatísticas de Processamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingJobs}</div>
            <p className="text-xs text-muted-foreground">Aguardando processamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Processando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processingCount}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
            <p className="text-xs text-muted-foreground">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Falhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedJobs}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Automação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Controles de Automação
          </CardTitle>
          <CardDescription>
            Gerencie o processamento automático de análises psicossociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Processamento
            </Button>
            <Button variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pausar Sistema
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reprocessar Falhas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fila de Processamento */}
      <Card>
        <CardHeader>
          <CardTitle>Fila de Processamento</CardTitle>
          <CardDescription>
            Jobs de processamento ativos e recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processingJobs && processingJobs.length > 0 ? (
            <div className="space-y-2">
              {processingJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="text-sm font-medium">{job.job_type}</p>
                      <p className="text-xs text-muted-foreground">
                        Criado: {new Date(job.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum job de processamento encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs de Processamento */}
      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
          <CardDescription>
            Últimas atividades do sistema de automação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processingLogs && processingLogs.length > 0 ? (
            <div className="space-y-2">
              {processingLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span>{log.processing_stage}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>Nenhum log disponível</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}