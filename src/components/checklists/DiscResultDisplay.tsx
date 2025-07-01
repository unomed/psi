import { ChecklistResult } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { DiscFactorDetails } from "./disc/DiscFactorDetails";
import { DiscFactorProgress } from "./disc/DiscFactorProgress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { DiscFactorType } from "@/types";

interface DiscResultDisplayProps {
  result: ChecklistResult;
  onClose: () => void;
}

export function DiscResultDisplay({ result, onClose }: DiscResultDisplayProps) {
  // Helper para verificar se results contém fatores DISC
  const isDISCResult = () => {
    return typeof result.results === 'object' && result.results !== null &&
      'D' in result.results && 'I' in result.results && 
      'S' in result.results && 'C' in result.results;
  };

  // Helper para renderizar resultados psicossociais
  const renderPsicossocialResults = () => {
    if (!result.categorizedResults && !result.results) return null;
    
    const resultsToUse = result.categorizedResults || result.results;
    if (typeof resultsToUse !== 'object' || !resultsToUse) return null;
    
    const categories = Object.keys(resultsToUse);
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Resultados por Categoria</h3>
        
        {categories.map(category => {
          // @ts-ignore - resultsToUse é um objeto com chaves de string
          const score = resultsToUse[category];
          const percentage = Math.round(score * 20); // 1-5 para percentual (1=20%, 5=100%)
          
          return (
            <Card key={category} className={
              percentage >= 80 ? "border-red-300" : 
              percentage >= 60 ? "border-orange-300" : 
              percentage >= 40 ? "border-yellow-300" : 
              "border-green-300"
            }>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category}</CardTitle>
                <CardDescription>
                  {percentage >= 80 ? "Alto risco" : 
                   percentage >= 60 ? "Risco moderado" : 
                   percentage >= 40 ? "Baixo risco" : 
                   "Sem risco significativo"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className={`h-2.5 rounded-full ${
                      percentage >= 80 ? "bg-red-500" : 
                      percentage >= 60 ? "bg-orange-500" : 
                      percentage >= 40 ? "bg-yellow-500" : 
                      "bg-green-500"
                    }`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Pontuação: {score.toFixed(1)} / 5.0
                </p>
              </CardContent>
            </Card>
          );
        })}
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Fator Principal:</h4>
          <p className="text-lg">{result.dominantFactor}</p>
          <p className="text-sm text-gray-600 mt-2">
            Este fator representa a área que mais se destacou na avaliação.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Resultado da Avaliação
        </h2>
        {result.employeeName && (
          <p className="text-gray-600">
            Funcionário: <span className="font-medium">{result.employeeName}</span>
          </p>
        )}
        <p className="text-gray-600">
          Data: <span className="font-medium">
            {new Date(result.completedAt).toLocaleDateString('pt-BR')}
          </span>
        </p>
      </div>

      {isDISCResult() ? (
        // Renderização original para DISC
        <>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {Object.entries(result.results).map(([factor, value]) => {
                if (factor === 'D' || factor === 'I' || factor === 'S' || factor === 'C') {
                  // Calculate percentage (assuming max score is 100)
                  const percentage = Math.round(value * 100);
                  return (
                    <DiscFactorProgress 
                      key={factor}
                      factor={factor as DiscFactorType} 
                      percentage={percentage} 
                    />
                  );
                }
                return null;
              })}
            </div>
            <DiscFactorDetails dominantFactor={result.dominantFactor} />
          </div>
        </>
      ) : (
        // Renderização para resultados psicossociais
        renderPsicossocialResults()
      )}

      <div className="flex justify-end mt-4">
        <Button onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}
