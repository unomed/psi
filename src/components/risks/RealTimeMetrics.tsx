import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, TrendingUp, Users, AlertTriangle, Brain } from "lucide-react";

interface RealTimeMetricsProps {
  selectedCompanyId: string | null;
}

export function RealTimeMetrics({ selectedCompanyId }: RealTimeMetricsProps) {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['psychosocial-metrics', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('psychosocial_metrics')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .order('calculation_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  });

  const { data: riskAnalyses } = useQuery({
    queryKey: ['recent-risk-analyses', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('psychosocial_risk_analysis')
        .select(`
          *,
          employees:employee_id(name),
          sectors:sector_id(name)
        `)
        .eq('company_id', selectedCompanyId)
        .order('evaluation_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
    refetchInterval: 60000 // Atualizar a cada minuto
  });

  const { data: processingStats } = useQuery({
    queryKey: ['processing-stats', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return null;
      
      // Simular chamada para função de estatísticas
      const { data, error } = await supabase.rpc('get_psychosocial_processing_stats', {
        p_company_id: selectedCompanyId,
        p_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        p_end_date: new Date().toISOString().split('T')[0]
      });
      
      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!selectedCompanyId,
    refetchInterval: 120000 // Atualizar a cada 2 minutos
  });

  const getExposureLevelColor = (level: string) => {
    switch (level) {
      case 'critico':
        return 'bg-red-100 text-red-800';
      case 'alto':
        return 'bg-orange-100 text-orange-800';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para monitoramento</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Carregando métricas em tempo real...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Processados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {processingStats?.total_processed || 0}
            </div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {processingStats ? 
                Math.round((processingStats.successful_processed / processingStats.total_processed) * 100) || 0 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Processamento automático</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Riscos Altos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {processingStats?.high_risk_found || 0}
            </div>
            <p className="text-xs text-muted-foreground">Identificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Planos Gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {processingStats?.action_plans_generated || 0}
            </div>
            <p className="text-xs text-muted-foreground">Automaticamente</p>
          </CardContent>
        </Card>
      </div>

      {/* Análises Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Análises Recentes
          </CardTitle>
          <CardDescription>
            Últimas análises de risco psicossocial processadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {riskAnalyses && riskAnalyses.length > 0 ? (
            <div className="space-y-3">
              {riskAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">
                        {analysis.employees?.name || 'Funcionário não identificado'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.sectors?.name || 'Setor não identificado'} • 
                        Score: {analysis.risk_score || 0}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getExposureLevelColor(analysis.exposure_level)}>
                      {analysis.exposure_level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(analysis.evaluation_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma análise recente encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>
            Indicadores de saúde do sistema de análise psicossocial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-medium">Processamento</p>
              <p className="text-xs text-muted-foreground">Ativo</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-medium">Base de Dados</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-medium">Notificações</p>
              <p className="text-xs text-muted-foreground">Funcionando</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-medium">Backup</p>
              <p className="text-xs text-muted-foreground">Agendado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}