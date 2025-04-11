
import { InfoIcon } from "lucide-react";
import { DiscFactor } from "@/types/checklist";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getFactorBackgroundColor, getFactorColor } from "./disc/DiscFactorsData";

interface DiscFactorCardProps {
  factor: DiscFactor;
  className?: string;
}

export function DiscFactorCard({ factor, className }: DiscFactorCardProps) {
  return (
    <Card className={cn("border", getFactorBackgroundColor(factor.type), className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className={cn("text-3xl font-bold", getFactorColor(factor.type))}>
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
