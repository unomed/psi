
import { ChecklistResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PsicossocialResultDisplay } from "@/components/checklists/PsicossocialResultDisplay";

interface AssessmentCompleteProps {
  result: ChecklistResult;
  onClose: () => void;
}

export function AssessmentComplete({ result, onClose }: AssessmentCompleteProps) {
  return (
    <div className="space-y-6">
      {/* Header de Sucesso */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <CheckCircle className="h-8 w-8" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Avaliação Concluída!</h2>
              <p className="text-sm text-green-600">
                Sua avaliação foi registrada com sucesso
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <PsicossocialResultDisplay result={result} />

      {/* Botão de Finalizar */}
      <div className="text-center pt-4">
        <Button onClick={onClose} size="lg">
          Finalizar
        </Button>
      </div>
    </div>
  );
}
