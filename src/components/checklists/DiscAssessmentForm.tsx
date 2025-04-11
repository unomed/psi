
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChecklistTemplate, 
  ChecklistResult, 
  DiscFactorType 
} from "@/types/checklist";
import { QuestionStep } from "./assessment/QuestionStep";
import { CompletionStep } from "./assessment/CompletionStep";
import { AssessmentNavigation } from "./assessment/AssessmentNavigation";

interface DiscAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (result: Omit<ChecklistResult, "id" | "completedAt">) => void;
  onCancel: () => void;
}

export function DiscAssessmentForm({ 
  template, 
  onSubmit,
  onCancel
}: DiscAssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [employeeName, setEmployeeName] = useState("");
  
  const isLastQuestion = currentStep === template.questions.length;
  const currentQuestion = !isLastQuestion ? template.questions[currentStep] : null;
  const canProceed = currentQuestion ? responses[currentQuestion.id] !== undefined : true;

  const handleResponseChange = (value: string) => {
    if (!currentQuestion) return;
    
    setResponses({
      ...responses,
      [currentQuestion.id]: parseInt(value)
    });
  };

  const handleNext = () => {
    if (currentQuestion && responses[currentQuestion.id] === undefined) {
      return; // Prevent advancing if question is unanswered
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleEmployeeNameChange = (name: string) => {
    setEmployeeName(name);
  };

  const calculateResults = () => {
    // Calculate results
    const factorScores = {
      D: 0,
      I: 0,
      S: 0,
      C: 0
    };
    
    // Calculate weighted scores for each factor
    template.questions.forEach(question => {
      const response = responses[question.id] || 0;
      const weightedResponse = response * question.weight;
      
      factorScores[question.targetFactor] += weightedResponse;
    });
    
    // Find dominant factor
    let dominantFactor: DiscFactorType = "D";
    let highestScore = factorScores.D;
    
    if (factorScores.I > highestScore) {
      dominantFactor = "I";
      highestScore = factorScores.I;
    }
    if (factorScores.S > highestScore) {
      dominantFactor = "S";
      highestScore = factorScores.S;
    }
    if (factorScores.C > highestScore) {
      dominantFactor = "C";
      highestScore = factorScores.C;
    }
    
    return {
      templateId: template.id,
      employeeName: employeeName.trim() || "Anônimo",
      results: factorScores,
      dominantFactor
    };
  };

  const handleSubmit = () => {
    const result = calculateResults();
    onSubmit(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          {!isLastQuestion ? (
            currentQuestion && (
              <QuestionStep
                question={currentQuestion}
                currentStep={currentStep}
                totalSteps={template.questions.length}
                selectedValue={responses[currentQuestion.id]?.toString()}
                onResponseChange={handleResponseChange}
              />
            )
          ) : (
            <CompletionStep
              employeeName={employeeName}
              onEmployeeNameChange={handleEmployeeNameChange}
              totalQuestions={template.questions.length}
            />
          )}
        </CardContent>
      </Card>
      
      <AssessmentNavigation
        currentStep={currentStep}
        isLastStep={isLastQuestion}
        canProceed={canProceed}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
