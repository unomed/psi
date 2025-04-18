
import { Progress } from "@/components/ui/progress";
import { DiscFactorType } from "@/types";
import { getFactorProgressColor } from "./DiscFactorsData";

interface DiscFactorProgressProps {
  factor: DiscFactorType;
  percentage: number;
}

export function DiscFactorProgress({ factor, percentage }: DiscFactorProgressProps) {
  // Garantir que o percentual está limitado entre 0 e 100
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">
          {factor === "D" && "Dominância (D)"}
          {factor === "I" && "Influência (I)"}
          {factor === "S" && "Estabilidade (S)"}
          {factor === "C" && "Conformidade (C)"}
        </span>
        <span>{normalizedPercentage}%</span>
      </div>
      <Progress 
        value={normalizedPercentage} 
        className="h-2 bg-gray-200" 
        indicatorClassName={getFactorProgressColor(factor)} 
      />
    </div>
  );
}
