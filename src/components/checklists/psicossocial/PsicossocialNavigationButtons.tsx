
import { Button } from "@/components/ui/button";

interface PsicossocialNavigationButtonsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  hasResponse: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
}

export function PsicossocialNavigationButtons({
  currentQuestionIndex,
  totalQuestions,
  hasResponse,
  isSubmitting,
  onPrevious,
  onNext,
  onCancel
}: PsicossocialNavigationButtonsProps) {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        Anterior
      </Button>

      <div className="flex gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!hasResponse || isSubmitting}
        >
          {isLastQuestion 
            ? (isSubmitting ? "Enviando..." : "Finalizar")
            : "Próxima"
          }
        </Button>
      </div>
    </div>
  );
}
