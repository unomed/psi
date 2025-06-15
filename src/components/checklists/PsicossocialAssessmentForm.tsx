
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistTemplate } from "@/types";
import { PsicossocialProgressHeader } from "./psicossocial/PsicossocialProgressHeader";
import { PsicossocialQuestionCard } from "./psicossocial/PsicossocialQuestionCard";
import { PsicossocialNavigationButtons } from "./psicossocial/PsicossocialNavigationButtons";
import { usePsicossocialAssessment } from "@/hooks/checklists/usePsicossocialAssessment";

interface PsicossocialAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PsicossocialAssessmentForm({ template, onSubmit, onCancel }: PsicossocialAssessmentFormProps) {
  const {
    currentQuestionIndex,
    currentQuestion,
    responses,
    isSubmitting,
    progress,
    questions,
    handleResponseChange,
    handleNext,
    handlePrevious
  } = usePsicossocialAssessment({ template, onSubmit });

  if (!currentQuestion) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Questionário vazio</h3>
        <p className="text-muted-foreground mb-4">
          Este questionário não possui perguntas configuradas.
        </p>
        <Button onClick={onCancel}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <PsicossocialProgressHeader
          title={template.title}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progress={progress}
        />

        <CardContent className="space-y-6">
          <PsicossocialQuestionCard
            question={currentQuestion}
            response={responses[currentQuestion.id]}
            onResponseChange={handleResponseChange}
          />

          <PsicossocialNavigationButtons
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            hasResponse={!!responses[currentQuestion.id]}
            isSubmitting={isSubmitting}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
