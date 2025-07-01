
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculatePsicossocialRisk } from "@/data/psicossocialTemplates";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface RiskIndicatorProps {
  score: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskIndicator({ score, showProgress = false, size = 'md' }: RiskIndicatorProps) {
  const risk = calculatePsicossocialRisk(score);

  const getRiskIcon = () => {
    const iconClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    
    switch (risk.level) {
      case 'baixo':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'medio':
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case 'alto':
        return <AlertTriangle className={`${iconClass} text-orange-500`} />;
      case 'critico':
        return <XCircle className={`${iconClass} text-red-500`} />;
      default:
        return <AlertCircle className={`${iconClass} text-gray-500`} />;
    }
  };

  const getBadgeVariant = () => {
    switch (risk.level) {
      case 'baixo':
        return 'default';
      case 'medio':
        return 'secondary';
      case 'alto':
        return 'destructive';
      case 'critico':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getProgressColor = () => {
    switch (risk.level) {
      case 'baixo':
        return 'bg-green-500';
      case 'medio':
        return 'bg-yellow-500';
      case 'alto':
        return 'bg-orange-500';
      case 'critico':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getRiskIcon()}
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : ''}`}>
            {score}%
          </span>
          <Badge variant={getBadgeVariant()} className={size === 'sm' ? 'text-xs' : ''}>
            {risk.label}
          </Badge>
        </div>
        
        {showProgress && (
          <div className="w-full">
            <Progress 
              value={score} 
              className={`h-${size === 'sm' ? '1' : size === 'lg' ? '3' : '2'}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
