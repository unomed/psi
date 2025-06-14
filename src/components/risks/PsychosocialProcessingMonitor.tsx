
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  Play
} from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";
import { PsychosocialAutomationService } from "@/services/riskManagement/psychosocialAutomationService";
import { toast } from "sonner";

interface PsychosocialProcessingMonitorProps {
  companyId?: string;
}

export function PsychosocialProcessingMonitor({ companyId }: PsychosocialProcessingMonitorProps) {
  const { processingLogs, stats, isLoading } = usePsychosocialAutomation(companyId);
  const [isSimulating, setIsSimulating] = useState(false);

  const recentLogs = processingLogs.slice(0, 5);
  const processingProgress = stats ? Math.round((stats.successful_processed / Math.max(stats.total_processed, 1)) * 100) : 0;

  const handleSimulateProcessing = async () => {
    if (!companyId) {
      toast.error('ID da empresa não encontrado');
      return;
    }

    setIsSimulating(true);
    try {
      const result = await PsychosocialAutomationService.simulateProcessing(companyId);
      if (result.success) {
        toast.success(`Simulação concluída: ${result.message}`);
      } else {
        toast.warning(`Simulação: ${result.message}`);
      }
    } catch (error) {
      console.error('Error simulating processing:', error);
      toast.error('Erro ao executar simulação');
    } finally {
      setIsSimulating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monitor de Processamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Monitor de Processamento
        </CardTitle>
        <CardDescription>
          Status em tempo real do processamento automático
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estatísticas gerais */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats?.successful_processed || 0}
            </div>
            <div className="text-sm text-muted-foreground">Sucessos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats?.failed_processed || 0}
            </div>
            <div className="text-sm text-muted-foreground">Falhas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats?.critical_risk_found || 0}
            </div>
            <div className="text-sm text-muted-foreground">Riscos Críticos</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Taxa de Sucesso</span>
            <span>{processingProgress}%</span>
          </div>
          <Progress value={processingProgress} className="h-2" />
        </div>

        {/* Logs recentes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Processamentos Recentes</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateProcessing}
              disabled={isSimulating}
            >
              {isSimulating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Simular Processamento
            </Button>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Nenhum processamento encontrado
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="text-sm font-medium">
                        Avaliação #{log.assessment_response_id.slice(-8)}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {log.processing_stage}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={log.status === 'completed' ? 'default' : 
                              log.status === 'error' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {log.status}
                    </Badge>
                    {log.error_message && (
                      <div className="text-xs text-red-500 mt-1 max-w-xs truncate">
                        {log.error_message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas */}
        {stats && stats.failed_processed > 0 && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                {stats.failed_processed} processamento(s) com falha encontrado(s)
              </span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Verifique os logs para mais detalhes sobre os erros.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
