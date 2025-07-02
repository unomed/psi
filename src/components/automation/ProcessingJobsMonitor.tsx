import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Clock, Settings, Activity, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingJob {
  id: string;
  assessment_response_id: string;
  company_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  retry_count: number;
  max_retries: number;
}

interface ProcessingStats {
  total_processed: number;
  successful_processed: number;
  failed_processed: number;
  avg_processing_time_seconds: number;
  high_risk_found: number;
  critical_risk_found: number;
  action_plans_generated: number;
  notifications_sent: number;
}

export function ProcessingJobsMonitor() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [backgroundProcessorRunning, setBackgroundProcessorRunning] = useState(false);
  
  const queryClient = useQueryClient();

  // Buscar empresas
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Buscar jobs de processamento
  const { data: jobs, isLoading: loadingJobs } = useQuery({
    queryKey: ['processing-jobs', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      const { data, error } = await supabase
        .from('psychosocial_processing_jobs')
        .select('*')
        .eq('company_id', selectedCompany)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as ProcessingJob[];
    },
    enabled: !!selectedCompany,
    refetchInterval: 5000 // Refresh a cada 5 segundos
  });

  // Buscar estatísticas de processamento
  const { data: stats } = useQuery({
    queryKey: ['processing-stats', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return null;
      
      const { data, error } = await supabase
        .rpc('get_psychosocial_processing_stats', {
          p_company_id: selectedCompany
        });
      
      if (error) throw error;
      return data[0] as ProcessingStats;
    },
    enabled: !!selectedCompany
  });

  // Mutation para popular jobs
  const populateJobsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('populate_processing_jobs');
      if (error) throw error;
      return data;
    },
    onSuccess: (jobCount) => {
      queryClient.invalidateQueries({ queryKey: ['processing-jobs'] });
      toast.success(`${jobCount} jobs criados para processamento`);
    },
    onError: (error: any) => {
      toast.error('Erro ao popular jobs: ' + error.message);
    }
  });

  // Mutation para processar assessment específico
  const processAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      const { data, error } = await supabase.rpc('process_psychosocial_assessment_with_notifications', {
        p_assessment_response_id: assessmentId
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ['processing-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['processing-stats'] });
      if (result?.success) {
        toast.success('Assessment processado com sucesso!');
      } else {
        toast.error('Falha no processamento: ' + (result?.message || 'Erro desconhecido'));
      }
    },
    onError: (error: any) => {
      toast.error('Erro ao processar assessment: ' + error.message);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'pending': return 'outline';
      case 'error': return 'destructive';
      case 'cancelled': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!selectedCompany) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Monitor de Processamento</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Selecione uma Empresa</CardTitle>
            <CardDescription>
              Escolha uma empresa para monitorar o processamento automático
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedCompanyData = companies?.find(c => c.id === selectedCompany);
  const pendingJobs = jobs?.filter(j => j.status === 'pending').length || 0;
  const processingJobs = jobs?.filter(j => j.status === 'processing').length || 0;
  const completedJobs = jobs?.filter(j => j.status === 'completed').length || 0;
  const errorJobs = jobs?.filter(j => j.status === 'error').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Monitor - {selectedCompanyData?.name}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => populateJobsMutation.mutate()}
            disabled={populateJobsMutation.isPending}
            variant="outline"
          >
            <Zap className="h-4 w-4 mr-2" />
            Popular Jobs
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Processado</p>
                  <p className="text-2xl font-bold">{stats.total_processed}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.total_processed > 0 ? 
                      ((stats.successful_processed / stats.total_processed) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Riscos Críticos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical_risk_found}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">
                    {formatDuration(stats.avg_processing_time_seconds || 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status da Fila */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Status da Fila de Processamento
          </CardTitle>
          <CardDescription>
            Situação atual dos jobs de processamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingJobs}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{processingJobs}</div>
              <div className="text-sm text-muted-foreground">Processando</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorJobs}</div>
              <div className="text-sm text-muted-foreground">Erros</div>
            </div>
          </div>
          
          {jobs && jobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progresso da Fila</span>
                <span className="text-sm">{completedJobs}/{jobs.length}</span>
              </div>
              <Progress 
                value={jobs.length > 0 ? (completedJobs / jobs.length) * 100 : 0} 
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Jobs de Processamento
          </CardTitle>
          <CardDescription>
            Últimos 100 jobs de processamento para esta empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingJobs ? (
            <div className="text-center py-4">Carregando jobs...</div>
          ) : jobs?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum job de processamento encontrado</p>
              <p className="text-sm">Clique em "Popular Jobs" para criar jobs automaticamente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs?.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusColor(job.status)}>
                        {job.status.toUpperCase()}
                      </Badge>
                      <Badge variant={getPriorityColor(job.priority)}>
                        {job.priority.toUpperCase()}
                      </Badge>
                      {job.retry_count > 0 && (
                        <Badge variant="outline">
                          Tentativa {job.retry_count}/{job.max_retries}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Assessment ID:</strong> {job.assessment_response_id.slice(0, 8)}...</p>
                      <p><strong>Criado:</strong> {formatDate(job.created_at)}</p>
                      {job.started_at && (
                        <p><strong>Iniciado:</strong> {formatDate(job.started_at)}</p>
                      )}
                      {job.completed_at && (
                        <p><strong>Concluído:</strong> {formatDate(job.completed_at)}</p>
                      )}
                      {job.error_message && (
                        <p className="text-red-600"><strong>Erro:</strong> {job.error_message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    {job.status === 'error' && job.retry_count < job.max_retries && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => processAssessmentMutation.mutate(job.assessment_response_id)}
                        disabled={processAssessmentMutation.isPending}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reprocessar
                      </Button>
                    )}
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