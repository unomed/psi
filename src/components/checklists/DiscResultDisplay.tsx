
import { BarChart3, Download } from "lucide-react";
import { 
  ChecklistResult, 
  DiscFactorType,
  DiscFactor
} from "@/types/checklist";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DiscFactorCard } from "./DiscFactorCard";

interface DiscResultDisplayProps {
  result: ChecklistResult;
  onClose: () => void;
}

export function DiscResultDisplay({ result, onClose }: DiscResultDisplayProps) {
  // DISC factor explanations
  const discFactors: Record<DiscFactorType, DiscFactor> = {
    D: {
      type: "D",
      name: "Dominância",
      description: "Pessoas com alta dominância são diretas, decisivas, orientadas a resultados e frequentemente assertivas. Preferem liderar e assumir riscos."
    },
    I: {
      type: "I",
      name: "Influência",
      description: "Pessoas com alta influência são entusiasmadas, amigáveis, otimistas e carismáticas. Valorizam relações interpessoais e comunicação aberta."
    },
    S: {
      type: "S",
      name: "Estabilidade",
      description: "Pessoas com alta estabilidade são pacientes, confiáveis, previsíveis e bons ouvintes. Valorizam cooperação, segurança e rotinas estabelecidas."
    },
    C: {
      type: "C",
      name: "Conformidade",
      description: "Pessoas com alta conformidade são analíticas, precisas, sistemáticas e cuidadosas. Valorizam qualidade, conhecimento técnico e processos estruturados."
    }
  };

  // Calculate total points for percentage calculation
  const totalPoints = Object.values(result.results).reduce((sum, value) => sum + value, 0);
  
  // Calculate percentage for each factor
  const factorPercentages = {
    D: Math.round((result.results.D / totalPoints) * 100) || 0,
    I: Math.round((result.results.I / totalPoints) * 100) || 0,
    S: Math.round((result.results.S / totalPoints) * 100) || 0,
    C: Math.round((result.results.C / totalPoints) * 100) || 0
  };

  // Get color for factor
  const getFactorColor = (type: DiscFactorType) => {
    switch (type) {
      case "D": return "text-red-700";
      case "I": return "text-yellow-700";
      case "S": return "text-green-700";
      case "C": return "text-blue-700";
    }
  };

  // Mock function to download results (would be implemented with actual PDF generation)
  const handleDownload = () => {
    console.log("Downloading results:", result);
    alert("O download do relatório será implementado em breve!");
  };

  return (
    <div className="space-y-6">
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
            <h3 className="text-lg font-medium">Perfil dominante: <span className={getFactorColor(result.dominantFactor)}>{result.dominantFactor} - {discFactors[result.dominantFactor].name}</span></h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Dominância (D)</span>
                  <span>{factorPercentages.D}%</span>
                </div>
                <Progress value={factorPercentages.D} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Influência (I)</span>
                  <span>{factorPercentages.I}%</span>
                </div>
                <Progress value={factorPercentages.I} className="h-2 bg-gray-200" indicatorClassName="bg-yellow-500" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Estabilidade (S)</span>
                  <span>{factorPercentages.S}%</span>
                </div>
                <Progress value={factorPercentages.S} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Conformidade (C)</span>
                  <span>{factorPercentages.C}%</span>
                </div>
                <Progress value={factorPercentages.C} className="h-2 bg-gray-200" indicatorClassName="bg-blue-500" />
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Relatório Detalhado
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Entenda seu perfil dominante</h3>
        <DiscFactorCard factor={discFactors[result.dominantFactor]} />
        
        <h3 className="text-lg font-medium mt-4">Todos os perfis DISC</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(discFactors).map((factor) => (
            <DiscFactorCard 
              key={factor.type} 
              factor={factor} 
              className={factor.type !== result.dominantFactor ? "opacity-70" : ""}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}
