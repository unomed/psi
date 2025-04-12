
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AssessmentActionsProps {
  onNewAssessment: () => void;
}

export function AssessmentActions({ onNewAssessment }: AssessmentActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Aplicação e registro de avaliações psicossociais individuais e coletivas.
        </p>
      </div>
      <Button onClick={onNewAssessment}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Avaliação
      </Button>
    </div>
  );
}
