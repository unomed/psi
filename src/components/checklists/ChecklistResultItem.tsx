
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
  // Use tanto employee_name quanto employeeName para compatibilidade
  const employeeName = result.employee_name || result.employeeName || "Anônimo";
  // Use tanto dominant_factor quanto dominantFactor para compatibilidade
  const dominantFactor = result.dominant_factor || result.dominantFactor || "N/A";

  return (
    <div 
      className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
      onClick={() => onViewResult(result)}
    >
      <div>
        <h3 className="font-medium">{template?.title || "Avaliação"}</h3>
        <p className="text-sm text-muted-foreground">
          {employeeName} - Perfil dominante: {dominantFactor}
        </p>
      </div>
      <Button variant="ghost" size="sm">
        Ver Detalhes
      </Button>
    </div>
  );
}
