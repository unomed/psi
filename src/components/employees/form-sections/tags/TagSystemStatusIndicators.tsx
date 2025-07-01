
import { AlertCircle, CheckCircle } from "lucide-react";

interface TagSystemStatusIndicatorsProps {
  hasLoadingIssues: boolean;
  hasDataIssues: boolean;
  systemHealthy: boolean;
}

export function TagSystemStatusIndicators({
  hasLoadingIssues,
  hasDataIssues,
  systemHealthy
}: TagSystemStatusIndicatorsProps) {
  if (systemHealthy) {
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  }
  
  return <AlertCircle className="h-4 w-4 text-yellow-600" />;
}
