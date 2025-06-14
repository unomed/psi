
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ProcessingAlertsProps {
  stats: {
    failed_processed: number;
  } | undefined;
}

export function ProcessingAlerts({ stats }: ProcessingAlertsProps) {
  if (!stats || stats.failed_processed === 0) {
    return null;
  }

  return (
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
  );
}
