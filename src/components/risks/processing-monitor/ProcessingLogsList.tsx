
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Activity, AlertTriangle } from "lucide-react";

interface ProcessingLog {
  id: string;
  assessment_response_id: string;
  status: 'processing' | 'completed' | 'error';
  processing_stage: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  details?: any;
}

interface ProcessingLogsListProps {
  logs: ProcessingLog[];
}

export function ProcessingLogsList({ logs }: ProcessingLogsListProps) {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'error':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getProcessingTime = (log: ProcessingLog) => {
    if (log.details?.processing_time_seconds) {
      const seconds = parseFloat(log.details.processing_time_seconds);
      return `${seconds.toFixed(2)}s`;
    }
    return null;
  };

  const getExposureLevel = (log: ProcessingLog) => {
    return log.details?.exposure_level || null;
  };

  const getExposureLevelColor = (level: string) => {
    switch (level) {
      case 'critico':
        return 'text-red-600';
      case 'alto':
        return 'text-orange-600';
      case 'medio':
        return 'text-yellow-600';
      case 'baixo':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getExposureLevelLabel = (level: string) => {
    switch (level) {
      case 'critico':
        return 'Crítico';
      case 'alto':
        return 'Alto';
      case 'medio':
        return 'Médio';
      case 'baixo':
        return 'Baixo';
      default:
        return level;
    }
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm">Nenhum log de processamento encontrado</p>
        <p className="text-xs mt-2">Execute uma simulação para ver os logs aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="border rounded-lg p-4 bg-card">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {getStatusIcon(log.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-medium">
                    Avaliação #{log.assessment_response_id.slice(-8)}
                  </div>
                  <Badge 
                    variant={getStatusBadgeVariant(log.status)}
                    className="text-xs"
                  >
                    {log.status === 'completed' ? 'Concluído' : 
                     log.status === 'error' ? 'Erro' : 
                     log.status === 'processing' ? 'Processando' : log.status}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="capitalize">
                    Estágio: {log.processing_stage === 'started' ? 'Iniciado' : 
                             log.processing_stage === 'finished' ? 'Finalizado' : log.processing_stage}
                  </div>
                  <div>
                    Iniciado: {formatTimestamp(log.created_at)}
                  </div>
                  {log.completed_at && (
                    <div>
                      Concluído: {formatTimestamp(log.completed_at)}
                    </div>
                  )}
                </div>

                {/* Detalhes adicionais */}
                <div className="mt-2 space-y-1">
                  {log.details?.employee_name && (
                    <div className="text-xs text-muted-foreground">
                      Funcionário: <span className="font-medium">{log.details.employee_name}</span>
                    </div>
                  )}
                  
                  {getExposureLevel(log) && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="text-xs">
                        Nível de exposição: <span className={`font-medium ${getExposureLevelColor(getExposureLevel(log))}`}>
                          {getExposureLevelLabel(getExposureLevel(log))}
                        </span>
                      </span>
                    </div>
                  )}

                  {getProcessingTime(log) && (
                    <div className="text-xs text-muted-foreground">
                      Tempo de processamento: <span className="font-medium">{getProcessingTime(log)}</span>
                    </div>
                  )}
                </div>

                {/* Mensagem de erro */}
                {log.error_message && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    <div className="font-medium mb-1">Erro:</div>
                    <div className="break-words">{log.error_message}</div>
                    {log.details?.error_hint && (
                      <div className="mt-1 text-red-500">
                        Dica: {log.details.error_hint}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
