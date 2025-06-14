
import { Progress } from "@/components/ui/progress";
import { discFactors, getFactorProgressColor, DiscFactorType } from "./DiscFactorsData";

interface DiscFactorProgressProps {
  factor: DiscFactorType;
  percentage: number;
}

export function DiscFactorProgress({ factor, percentage }: DiscFactorProgressProps) {
  const factorData = discFactors[factor];
  const progressColor = getFactorProgressColor(factor);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{factorData.name}</span>
        <span className="text-sm text-muted-foreground">
          {percentage}%
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
      />
      <p className="text-xs text-muted-foreground">
        {factorData.description}
      </p>
    </div>
  );
}
