
import React from "react";

interface ProcessingStatisticsProps {
  stats: {
    successful_processed: number;
    failed_processed: number;
    critical_risk_found: number;
  } | undefined;
}

export function ProcessingStatistics({ stats }: ProcessingStatisticsProps) {
  return (
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
  );
}
