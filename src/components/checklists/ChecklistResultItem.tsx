
import { ChecklistResult, ChecklistTemplate } from "@/types";
import { Button } from "@/components/ui/button";

interface ChecklistResultItemProps {
  result: ChecklistResult;
  template?: ChecklistTemplate;
  onViewResult: (result: ChecklistResult) => void;
}

export function ChecklistResultItem({ 
  result, 
  template, 
  onViewResult 
}: ChecklistResultItemProps) {
  return (
    <div 
      className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
      onClick={() => onViewResult(result)}
    >
      <div>
        <h3 className="font-medium">{template?.title || "Avaliação"}</h3>
        <p className="text-sm text-muted-foreground">
          {result.employeeName || "Anônimo"} - Perfil dominante: {result.dominantFactor}
        </p>
      </div>
      <Button variant="ghost" size="sm">
        Ver Detalhes
      </Button>
    </div>
  );
}
