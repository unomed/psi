
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Activity } from "lucide-react";

interface ProcessingLog {
  id: string;
  assessment_response_id: string;
  status: 'processing' | 'completed' | 'error';
  processing_stage: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
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

  if (logs.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        Nenhum processamento encontrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
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
  );
}
