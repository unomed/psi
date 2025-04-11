
import { Button } from "@/components/ui/button";
import { ChecklistResult } from "@/types/checklist";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";

interface AssessmentCompleteProps {
  result: ChecklistResult;
  onClose: () => void;
}

export function AssessmentComplete({ result, onClose }: AssessmentCompleteProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
        <p className="text-green-700 font-medium">
          Sua avaliação foi enviada com sucesso!
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Seus Resultados:</h3>
        <DiscResultDisplay 
          result={result} 
          onClose={onClose}
        />
      </div>
      
      <div className="flex justify-center mt-6">
        <Button onClick={onClose}>
          Voltar para o início
        </Button>
      </div>
    </div>
  );
}
