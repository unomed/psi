
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Pause, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Cpu,
  ListChecks
} from "lucide-react";
import { useBackgroundProcessor } from "@/hooks/usePsychosocialAutomation/useBackgroundProcessor";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { toast } from "sonner";

export function BackgroundProcessingMonitor() {
  const { 
    processingStatus, 
    isLoading, 
    queueJob, 
    stopProcessing, 
    startProcessing 
  } = useBackgroundProcessor();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Monitor de Processamento em Background
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton lines={4} />
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (!processingStatus?.isProcessing) return "bg-gray-500";
    if (processingStatus.activeJobs > 0) return "bg-green-500";
    return "bg-yellow-500";
  };

  const getStatusText = () => {
    if (!processingStatus?.isProcessing) return "Parado";
    if (processingStatus.activeJobs > 0) return "Processando";
    return "Aguardando";
  };

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Monitor de Processamento em Background
              </CardTitle>
              <CardDescription>
                Status do sistema de processamento automático de avaliações
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse`} />
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controles */}
          <div className="flex gap-2">
            {processingStatus?.isProcessing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => stopProcessing.mutate()}
                disabled={stopProcessing.isPending}
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pausar Processamento
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => startProcessing.mutate()}
                disabled={startProcessing.isPending}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Iniciar Processamento
              </Button>
            )}
          </div>

          {/* Alertas */}
          {!processingStatus?.isProcessing && processingStatus?.queueLength > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Existem {processingStatus.queueLength} avaliações aguardando processamento. 
                Inicie o processamento para continuar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Métricas da Fila */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fila de Processamento</CardTitle>
            <ListChecks className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {processingStatus?.queueLength || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações aguardando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Ativos</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {processingStatus?.activeJobs || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Processando agora
            </p>
            {processingStatus?.activeJobs > 0 && (
              <Progress value={66} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Sistema</CardTitle>
            {processingStatus?.isProcessing ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Clock className="h-4 w-4 text-yellow-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {processingStatus?.isProcessing ? (
                <span className="text-green-600">Operacional</span>
              ) : (
                <span className="text-yellow-600">Pausado</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Sistema de automação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Detalhes do Processamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Capacidade máxima:</span>
              <span className="ml-2 font-medium">3 jobs simultâneos</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tempo médio:</span>
              <span className="ml-2 font-medium">~30 segundos/avaliação</span>
            </div>
            <div>
              <span className="text-muted-foreground">Retry automático:</span>
              <span className="ml-2 font-medium">Até 3 tentativas</span>
            </div>
            <div>
              <span className="text-muted-foreground">Intervalo verificação:</span>
              <span className="ml-2 font-medium">5 segundos</span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <h4 className="font-medium mb-2">Recursos do Processamento Automático:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cálculo avançado de riscos psicossociais conforme Manual MTE</li>
              <li>• Geração inteligente de planos de ação baseados em templates</li>
              <li>• Notificações automáticas para riscos altos e críticos</li>
              <li>• Agendamento automático de reavaliações</li>
              <li>• Log completo de todas as operações</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
