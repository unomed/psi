
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProcessingProgressBarProps {
  stats: {
    successful_processed: number;
    total_processed: number;
  } | undefined;
}

export function ProcessingProgressBar({ stats }: ProcessingProgressBarProps) {
  const processingProgress = stats ? Math.round((stats.successful_processed / Math.max(stats.total_processed, 1)) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Taxa de Sucesso</span>
        <span>{processingProgress}%</span>
      </div>
      <Progress value={processingProgress} className="h-2" />
    </div>
  );
}
