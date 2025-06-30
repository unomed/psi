
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiscResultSummaryProps {
  results: any;
  dominantFactor: string;
}

export function DiscResultSummary({ results, dominantFactor }: DiscResultSummaryProps) {
  const factors = results?.factors || results || {};
  
  // Ensure factors are numbers for calculations
  const getFactorScore = (factor: string): number => {
    const score = factors[factor];
    return typeof score === 'number' ? score : 0;
  };

  const totalScore = getFactorScore('D') + getFactorScore('I') + getFactorScore('S') + getFactorScore('C');
  
  const percentages = {
    D: totalScore > 0 ? Math.round((getFactorScore('D') / totalScore) * 100) : 0,
    I: totalScore > 0 ? Math.round((getFactorScore('I') / totalScore) * 100) : 0,
    S: totalScore > 0 ? Math.round((getFactorScore('S') / totalScore) * 100) : 0,
    C: totalScore > 0 ? Math.round((getFactorScore('C') / totalScore) * 100) : 0,
  };

  const getFactorName = (factor: string) => {
    switch(factor) {
      case 'D': return 'Dominância';
      case 'I': return 'Influência';
      case 'S': return 'Estabilidade';
      case 'C': return 'Conformidade';
      default: return factor;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Resumo DISC
          <Badge variant="secondary">{getFactorName(dominantFactor)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(percentages).map(([factor, percentage]) => (
            <div key={factor} className="flex items-center justify-between">
              <span className="font-medium">{getFactorName(factor)} ({factor})</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Perfil Dominante:</strong> {getFactorName(dominantFactor)} com {percentages[dominantFactor as keyof typeof percentages]}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
