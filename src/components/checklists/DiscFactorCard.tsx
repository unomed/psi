
import { InfoIcon } from "lucide-react";
import { DiscFactor, DiscFactorType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getFactorBackgroundColor, getFactorColor } from "./disc/DiscFactorsData";

interface DiscFactorCardProps {
  factor: DiscFactor | undefined;
  className?: string;
}

export function DiscFactorCard({ factor, className }: DiscFactorCardProps) {
  // Add null check for factor to prevent "Cannot read properties of undefined (reading 'type')"
  if (!factor) {
    return (
      <Card className={cn("border bg-gray-50", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">Fator não disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-foreground/80">
            Não foi possível encontrar informações para este fator.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  // Garantir que factor.type existe
  const factorType = factor.type || 'D';

  return (
    <Card className={cn("border", getFactorBackgroundColor(factorType), className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className={cn("text-3xl font-bold", getFactorColor(factorType))}>
            {factorType}
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
