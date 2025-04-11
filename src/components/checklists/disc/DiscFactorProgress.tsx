
import { Progress } from "@/components/ui/progress";
import { DiscFactorType } from "@/types/checklist";
import { getFactorProgressColor } from "./DiscFactorsData";

interface DiscFactorProgressProps {
  factor: DiscFactorType;
  percentage: number;
}

export function DiscFactorProgress({ factor, percentage }: DiscFactorProgressProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">
          {factor === "D" && "Dominância (D)"}
          {factor === "I" && "Influência (I)"}
          {factor === "S" && "Estabilidade (S)"}
          {factor === "C" && "Conformidade (C)"}
        </span>
        <span>{percentage}%</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2 bg-gray-200" 
        indicatorClassName={getFactorProgressColor(factor)} 
      />
    </div>
  );
}
