
import { ChecklistResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DiscResultDisplayProps {
  result: ChecklistResult;
  onClose: () => void;
}

export function DiscResultDisplay({ result, onClose }: DiscResultDisplayProps) {
  // Safely parse the results to handle Json type
  const parseResults = (results: any) => {
    if (typeof results === 'object' && results !== null) {
      return results.factors || results || {};
    }
    return {};
  };

  const factors = parseResults(result.results);
  
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

  const getFactorDescription = (factor: string) => {
    switch(factor) {
      case 'D': return 'Orientado para resultados, direto, determinado';
      case 'I': return 'Sociável, otimista, comunicativo';
      case 'S': return 'Paciente, leal, bom ouvinte';
      case 'C': return 'Preciso, analítico, sistemático';
      default: return '';
    }
  };

  // Use tanto employee_name quanto employeeName para compatibilidade
  const employeeName = result.employee_name || result.employeeName || "Funcionário";
  // Use tanto dominant_factor quanto dominantFactor para compatibilidade
  const dominantFactor = result.dominant_factor || result.dominantFactor || "D";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resultado DISC - {employeeName}</span>
            <Badge variant="secondary">{getFactorName(dominantFactor)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(percentages).map(([factor, percentage]) => (
              <div key={factor}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{getFactorName(factor)} ({factor})</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      factor === dominantFactor ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getFactorDescription(factor)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perfil Dominante: {getFactorName(dominantFactor)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {getFactorDescription(dominantFactor)}
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm">
              <strong>Pontuação:</strong> {percentages[dominantFactor as keyof typeof percentages]}% do perfil total
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}
