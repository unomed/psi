
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistResult, DiscFactorType } from "@/types";

interface DiscResultSummaryProps {
  result: ChecklistResult;
}

export function DiscResultSummary({ result }: DiscResultSummaryProps) {
  // ✅ ADICIONAR type assertions para resolver erros de unknown:
  const responses = result.responses as Record<string, number>;
  const analysis = result.analysis as any;
  
  // Calcular totais com type assertion
  const totalD = Object.values(responses).reduce((sum: number, val: number) => sum + (Number(val) || 0), 0);
  
  // ✅ ADICIONAR type assertions para cálculos:
  const percentageD = Math.round((Number(analysis?.D || 0) / totalD) * 100);
  const percentageI = Math.round((Number(analysis?.I || 0) / totalD) * 100);
  const percentageS = Math.round((Number(analysis?.S || 0) / totalD) * 100);
  const percentageC = Math.round((Number(analysis?.C || 0) / totalD) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Resultado DISC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Number(analysis?.D || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Dominância</div>
              <div className="text-xs">{percentageD}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Number(analysis?.I || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Influência</div>
              <div className="text-xs">{percentageI}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Number(analysis?.S || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Estabilidade</div>
              <div className="text-xs">{percentageS}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Number(analysis?.C || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Conformidade</div>
              <div className="text-xs">{percentageC}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result.dominantFactor && (
        <Card>
          <CardHeader>
            <CardTitle>Fator Dominante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold mb-2">
              {result.dominantFactor} - {result.dominantFactor === 'D' ? 'Dominância' : 
                                      result.dominantFactor === 'I' ? 'Influência' :
                                      result.dominantFactor === 'S' ? 'Estabilidade' :
                                      'Conformidade'}
            </div>
            <p className="text-muted-foreground">
              Este é o fator predominante no perfil comportamental.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
