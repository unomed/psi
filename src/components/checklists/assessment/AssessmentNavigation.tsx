
import { Button } from "@/components/ui/button";

interface AssessmentNavigationProps {
  currentStep: number;
  isLastStep: boolean;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AssessmentNavigation({
  currentStep,
  isLastStep,
  canProceed,
  onPrevious,
  onNext,
  onSubmit,
  onCancel
}: AssessmentNavigationProps) {
  return (
    <div className="flex justify-between">
      {currentStep > 0 ? (
        <Button type="button" variant="outline" onClick={onPrevious}>
          Anterior
        </Button>
      ) : (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
      
      {!isLastStep ? (
        <Button 
          type="button" 
          onClick={onNext}
          disabled={!canProceed}
        >
          Próxima
        </Button>
      ) : (
        <Button type="button" onClick={onSubmit}>
          Finalizar Avaliação
        </Button>
      )}
    </div>
  );
}
