import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Mail,
  Eye,
  Settings,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FRPRTReportsManagerProps {
  selectedCompanyId: string | null;
}

export function FRPRTReportsManager({ selectedCompanyId }: FRPRTReportsManagerProps) {
  const { userRole } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Buscar histórico de relatórios
  const { data: reportHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['report-history', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('report_history')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .order('generated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId
  });

  // Buscar relatórios agendados
  const { data: scheduledReports = [], isLoading: loadingScheduled } = useQuery({
    queryKey: ['scheduled-reports', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .eq('is_active', true)
        .order('next_generation_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId
  });

  // Buscar avaliações de risco
  const { data: riskAssessments = [] } = useQuery({
    queryKey: ['risk-assessments', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`
          *,
          employees!inner(name, sector_id, role_id),
          sectors!inner(name),
          roles!inner(name)
        `)
        .eq('company_id', selectedCompanyId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId
  });

  // Calcular métricas simples baseadas nas avaliações
  const simpleMetrics = {
    totalAssessments: riskAssessments.length,
    criticalCount: riskAssessments.filter(a => a.overall_risk_level === 'critico').length,
    highCount: riskAssessments.filter(a => a.overall_risk_level === 'alto').length,
    pendingActions: riskAssessments.filter(a => a.compliance_status === 'pending').length,
    overdue: riskAssessments.filter(a => 
      a.action_deadline && new Date(a.action_deadline) < new Date() && a.compliance_status !== 'completed'
    ).length
  };

  // Gerar novo relatório
  const generateReport = useMutation({
    mutationFn: async (reportType: string) => {
      if (!selectedCompanyId) throw new Error('Company ID required');
      
      const { data, error } = await supabase.rpc('calculate_company_frprt_metrics', {
        p_company_id: selectedCompanyId
      });
      
      if (error) throw error;
      
      // Usar estrutura da tabela existente
      const reportData = {
        company_id: selectedCompanyId,
        report_name: `Relatório FRPRT - ${new Date().toLocaleDateString('pt-BR')}`,
        report_data: data || {},
        status: 'generated' as const
      };
      
      const { data: report, error: reportError } = await supabase
        .from('report_history')
        .insert([reportData])
        .select()
        .single();
      
      if (reportError) throw reportError;
      return report;
    },
    onSuccess: () => {
      toast.success('Relatório gerado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['report-history'] });
    },
    onError: (error) => {
      toast.error('Erro ao gerar relatório: ' + error.message);
    }
  });

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'nr01_compliance': return 'Compliance NR-01';
      case 'frprt_analysis': return 'Análise FRPRT';
      case 'sector_analysis': return 'Análise por Setor';
      default: return 'Relatório Geral';
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'nr01_compliance': return 'bg-red-100 text-red-800';
      case 'frprt_analysis': return 'bg-blue-100 text-blue-800';
      case 'sector_analysis': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critico': return 'text-red-600';
      case 'alto': return 'text-orange-600';
      case 'medio': return 'text-yellow-600';
      case 'baixo': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para visualizar relatórios FRPRT</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios FRPRT</h2>
          <p className="text-muted-foreground">
            Relatórios automáticos conforme classificação NR-01
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => generateReport.mutate('frprt_analysis')}
            disabled={generateReport.isPending}
          >
            <FileText className="mr-2 h-4 w-4" />
            Análise FRPRT
          </Button>
          <Button
            onClick={() => generateReport.mutate('nr01_compliance')}
            disabled={generateReport.isPending}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatório NR-01
          </Button>
        </div>
      </div>

      {/* Métricas Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{simpleMetrics.totalAssessments}</div>
            <p className="text-xs text-muted-foreground">Total avaliadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exposição Crítica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{simpleMetrics.criticalCount}</div>
            <p className="text-xs text-muted-foreground">Ação imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exposição Alta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{simpleMetrics.highCount}</div>
            <p className="text-xs text-muted-foreground">30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{simpleMetrics.overdue}</div>
            <p className="text-xs text-muted-foreground">Ações atrasadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{simpleMetrics.pendingActions}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="history">
            <FileText className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Calendar className="h-4 w-4 mr-2" />
            Agendados
          </TabsTrigger>
          <TabsTrigger value="assessments">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Avaliações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {loadingHistory ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando relatórios...</p>
              </div>
            ) : reportHistory.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Nenhum relatório encontrado</p>
                <p className="text-muted-foreground mb-4">
                  Gere seu primeiro relatório FRPRT clicando no botão acima
                </p>
              </div>
            ) : (
              reportHistory.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{report.report_name}</CardTitle>
                        <CardDescription>
                          Gerado em {new Date(report.generation_date || report.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Relatório FRPRT
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span className="font-medium capitalize">{report.status}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Dados do relatório disponíveis</p>
                        <p className="text-xs text-muted-foreground">
                          Relatório com análise completa FRPRT conforme NR-01
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">
                          Criado em {new Date(report.created_at).toLocaleString('pt-BR')}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-3 w-3" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Configure relatórios automáticos baseados em frequência
            </p>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurar Agendamento
            </Button>
          </div>
          
          <div className="grid gap-4">
            {loadingScheduled ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando agendamentos...</p>
              </div>
            ) : scheduledReports.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Nenhum relatório agendado</p>
                <p className="text-muted-foreground mb-4">
                  Configure relatórios automáticos para receber análises regulares
                </p>
              </div>
            ) : (
              scheduledReports.map((scheduled) => (
                <Card key={scheduled.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{scheduled.report_name}</CardTitle>
                        <CardDescription>Frequência: {scheduled.schedule_frequency}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        Próximo: {new Date(scheduled.next_generation_date).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Recipients: {Array.isArray(scheduled.recipients) ? scheduled.recipients.length : 0} email(s)
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-3 w-3" />
                          Enviar Agora
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-3 w-3" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <div className="grid gap-4">
            {riskAssessments.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Nenhuma avaliação de risco encontrada</p>
                <p className="text-muted-foreground">
                  As avaliações serão processadas automaticamente conforme os questionários são respondidos
                </p>
              </div>
            ) : (
              riskAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{assessment.employees?.name}</CardTitle>
                        <CardDescription>
                          {assessment.sectors?.name} - {assessment.roles?.name}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getRiskLevelColor(assessment.overall_risk_level)} bg-transparent border-current`}>
                          {assessment.overall_risk_level.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Exposição {assessment.exposure_intensity}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-medium">Organização</p>
                          <p className={assessment.frprt_organizacao_trabalho >= 61 ? 'text-red-600' : 'text-green-600'}>
                            {assessment.frprt_organizacao_trabalho}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Condições</p>
                          <p className={assessment.frprt_condicoes_psicossociais >= 61 ? 'text-red-600' : 'text-green-600'}>
                            {assessment.frprt_condicoes_psicossociais}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Relações</p>
                          <p className={assessment.frprt_relacoes_socioprofissionais >= 61 ? 'text-red-600' : 'text-green-600'}>
                            {assessment.frprt_relacoes_socioprofissionais}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Reconhecimento</p>
                          <p className={assessment.frprt_reconhecimento_crescimento >= 61 ? 'text-red-600' : 'text-green-600'}>
                            {assessment.frprt_reconhecimento_crescimento}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Equilíbrio</p>
                          <p className={assessment.frprt_equilibrio_trabalho_vida >= 61 ? 'text-red-600' : 'text-green-600'}>
                            {assessment.frprt_equilibrio_trabalho_vida}
                          </p>
                        </div>
                      </div>
                      
                      {assessment.action_deadline && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Prazo para ação:</span>
                          <span className={new Date(assessment.action_deadline) < new Date() ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                            {new Date(assessment.action_deadline).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">
                          Status: {assessment.compliance_status === 'pending' ? 'Pendente' : 
                                  assessment.compliance_status === 'in_progress' ? 'Em andamento' : 'Concluído'}
                        </span>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-3 w-3" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}