
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";
import { ProcessingStatistics } from "./processing-monitor/ProcessingStatistics";
import { ProcessingProgressBar } from "./processing-monitor/ProcessingProgressBar";
import { ProcessingLogsList } from "./processing-monitor/ProcessingLogsList";
import { ProcessingAlerts } from "./processing-monitor/ProcessingAlerts";
import { SimulateProcessingButton } from "./processing-monitor/SimulateProcessingButton";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { RiskErrorBoundary } from "./error-boundary/RiskErrorBoundary";

interface PsychosocialProcessingMonitorProps {
  companyId?: string;
}

export function PsychosocialProcessingMonitor({ companyId }: PsychosocialProcessingMonitorProps) {
  const { processingLogs, stats, isLoading } = usePsychosocialAutomation(companyId);

  const recentLogs = processingLogs.slice(0, 5);

  if (isLoading) {
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
        <CardContent>
          <LoadingSkeleton variant="card" lines={6} />
        </CardContent>
      </Card>
    );
  }

  return (
    <RiskErrorBoundary>
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
          <ProcessingStatistics stats={stats} />

          {/* Progress bar */}
          <ProcessingProgressBar stats={stats} />

          {/* Logs recentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Processamentos Recentes</h4>
              <SimulateProcessingButton companyId={companyId} />
            </div>

            <ProcessingLogsList logs={recentLogs} />
          </div>

          {/* Alertas */}
          <ProcessingAlerts stats={stats} />
        </CardContent>
      </Card>
    </RiskErrorBoundary>
  );
}
