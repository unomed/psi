
import { Progress } from "@/components/ui/progress";
import { DiscFactorData } from "./DiscFactorsData";

interface DiscFactorProgressProps {
  factor: DiscFactorData;
  score: number;
  maxScore: number;
}

export function DiscFactorProgress({ factor, score, maxScore }: DiscFactorProgressProps) {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{factor.name}</span>
        <span className="text-sm text-muted-foreground">
          {score}/{maxScore}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
      />
      <p className="text-xs text-muted-foreground">
        {factor.description}
      </p>
    </div>
  );
}
