
import { InfoIcon } from "lucide-react";
import { DiscFactor } from "@/types/checklist";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DiscFactorCardProps {
  factor: DiscFactor;
  className?: string;
}

export function DiscFactorCard({ factor, className }: DiscFactorCardProps) {
  const getFactorColor = (type: string) => {
    switch (type) {
      case "D": return "bg-red-50 border-red-200";
      case "I": return "bg-yellow-50 border-yellow-200";
      case "S": return "bg-green-50 border-green-200";
      case "C": return "bg-blue-50 border-blue-200";
      default: return "";
    }
  };

  const getFactorTextColor = (type: string) => {
    switch (type) {
      case "D": return "text-red-700";
      case "I": return "text-yellow-700";
      case "S": return "text-green-700";
      case "C": return "text-blue-700";
      default: return "";
    }
  };

  return (
    <Card className={cn("border", getFactorColor(factor.type), className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className={cn("text-3xl font-bold", getFactorTextColor(factor.type))}>
            {factor.type}
          </span>
          <span>{factor.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-foreground/80">
          {factor.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
