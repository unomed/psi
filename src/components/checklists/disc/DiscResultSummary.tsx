
import { BarChart3, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistResult, DiscFactorType } from "@/types";
import { DiscFactorProgress } from "./DiscFactorProgress";
import { discFactors, getFactorColor } from "./DiscFactorsData";

interface DiscResultSummaryProps {
  result: ChecklistResult;
  onDownload: () => void;
}

export function DiscResultSummary({ result, onDownload }: DiscResultSummaryProps) {
  // Calculate total points for percentage calculation
  const totalPoints = Object.values(result.results).reduce((sum, value) => sum + value, 0);
  
  // Calculate percentage for each factor
  const factorPercentages = {
    [DiscFactorType.D]: Math.round((result.results.D / totalPoints) * 100) || 0,
    [DiscFactorType.I]: Math.round((result.results.I / totalPoints) * 100) || 0,
    [DiscFactorType.S]: Math.round((result.results.S / totalPoints) * 100) || 0,
    [DiscFactorType.C]: Math.round((result.results.C / totalPoints) * 100) || 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Resultado da Avaliação DISC
        </CardTitle>
        <CardDescription>
          {result.employeeName ? `Avaliação de ${result.employeeName}` : "Avaliação anônima"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Perfil dominante: 
            <span className={getFactorColor(result.dominantFactor)}>
              {" "}{result.dominantFactor} - {discFactors[result.dominantFactor].name}
            </span>
          </h3>
          
          <div className="space-y-3">
            <DiscFactorProgress factor={DiscFactorType.D} percentage={factorPercentages[DiscFactorType.D]} />
            <DiscFactorProgress factor={DiscFactorType.I} percentage={factorPercentages[DiscFactorType.I]} />
            <DiscFactorProgress factor={DiscFactorType.S} percentage={factorPercentages[DiscFactorType.S]} />
            <DiscFactorProgress factor={DiscFactorType.C} percentage={factorPercentages[DiscFactorType.C]} />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar Relatório Detalhado
        </Button>
      </CardContent>
    </Card>
  );
}
