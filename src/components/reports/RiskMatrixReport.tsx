
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/types/date";

interface RiskMatrixReportProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskMatrixReport({ filters }: RiskMatrixReportProps) {
  // Cores para os diferentes níveis de risco
  const riskColors = {
    "baixo": "bg-green-100 border-green-200",
    "medio": "bg-amber-100 border-amber-200",
    "alto": "bg-red-100 border-red-200"
  };
  
  // Estratégias baseadas no nível de risco
  const riskStrategies = {
    "baixo": "Reter",
    "medio": "Mitigar",
    "alto": "Evitar"
  };
  
  // Quantidades para cada célula da matriz
  const matrixData = [
    [5, 6, 11], // Baixo impacto (3 colunas: prob. baixa, média, alta)
    [8, 7, 16], // Médio impacto
    [9, 11, 9]  // Alto impacto
  ];
  
  const impactLabels = ["Baixo", "Médio", "Alto"];
  const probabilityLabels = ["Baixa", "Média", "Alta"];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Matriz de Riscos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="grid grid-cols-3 gap-1 w-full">
            {matrixData.map((row, rowIndex) => (
              row.map((value, colIndex) => {
                // Determinar o nível de risco baseado na posição na matriz
                let riskLevel = "baixo";
                if ((rowIndex === 2 && colIndex >= 1) || (rowIndex >= 1 && colIndex === 2)) {
                  riskLevel = "alto";
                } else if ((rowIndex === 1 && colIndex === 1) || (rowIndex === 0 && colIndex === 2) || (rowIndex === 2 && colIndex === 0)) {
                  riskLevel = "medio";
                }
                
                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`} 
                    className={`p-4 rounded border flex flex-col items-center ${riskColors[riskLevel as keyof typeof riskColors]}`}
                  >
                    <div className="font-bold">{riskStrategies[riskLevel as keyof typeof riskStrategies]}</div>
                    <div className="text-xl font-bold mt-2">{value < 10 ? `0${value}` : value}</div>
                  </div>
                );
              })
            ))}
          </div>
          
          <div className="mt-2 grid grid-cols-3 text-center text-sm">
            {probabilityLabels.map((label, index) => (
              <div key={index}>Probabilidade {label.toLowerCase()}</div>
            ))}
          </div>
          
          <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-bold">
            Impacto
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
