import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChecklistTemplate, 
  ChecklistResult, 
  DiscFactorType,
  PsicossocialQuestion,
  ChecklistQuestion
} from "@/types";
import { QuestionStep } from "./assessment/QuestionStep";
import { CompletionStep } from "./assessment/CompletionStep";
import { AssessmentNavigation } from "./assessment/AssessmentNavigation";
import { DiscQuestion } from "@/types/disc";

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
    if (template.type === "disc") {
      const factorScores = {
        [DiscFactorType.D]: 0,
        [DiscFactorType.I]: 0,
        [DiscFactorType.S]: 0,
        [DiscFactorType.C]: 0
      };
      
      template.questions.forEach(question => {
        if ('targetFactor' in question && 'weight' in question) {
          const discQuestion = question as DiscQuestion;
          const response = responses[question.id] || 0;
          if (discQuestion.targetFactor && discQuestion.weight) {
            const weightedResponse = response * discQuestion.weight;
            factorScores[discQuestion.targetFactor] += weightedResponse;
          }
        }
      });
      
      let dominantFactor: DiscFactorType = DiscFactorType.D;
      let highestScore = factorScores[DiscFactorType.D];
      
      if (factorScores[DiscFactorType.I] > highestScore) {
        dominantFactor = DiscFactorType.I;
        highestScore = factorScores[DiscFactorType.I];
      }
      if (factorScores[DiscFactorType.S] > highestScore) {
        dominantFactor = DiscFactorType.S;
        highestScore = factorScores[DiscFactorType.S];
      }
      if (factorScores[DiscFactorType.C] > highestScore) {
        dominantFactor = DiscFactorType.C;
        highestScore = factorScores[DiscFactorType.C];
      }
      
      return {
        templateId: template.id,
        employeeName: employeeName.trim() || "Anônimo",
        results: factorScores,
        dominantFactor
      };
    } else if (template.type === "psicossocial") {
      const categorizedResults: Record<string, number> = {};
      const categoryCount: Record<string, number> = {};
      
      template.questions.forEach(question => {
        if ('category' in question) {
          const psicossocialQuestion = question as PsicossocialQuestion;
          const response = responses[question.id] || 0;
          const category = psicossocialQuestion.category;
          
          if (!categorizedResults[category]) {
            categorizedResults[category] = 0;
            categoryCount[category] = 0;
          }
          
          categorizedResults[category] += response;
          categoryCount[category]++;
        }
      });
      
      Object.keys(categorizedResults).forEach(category => {
        if (categoryCount[category] > 0) {
          categorizedResults[category] = Math.round(categorizedResults[category] / categoryCount[category] * 100) / 100;
        }
      });
      
      let dominantCategory = "";
      let highestScore = 0;
      
      Object.keys(categorizedResults).forEach(category => {
        if (categorizedResults[category] > highestScore) {
          dominantCategory = category;
          highestScore = categorizedResults[category];
        }
      });
      
      return {
        templateId: template.id,
        employeeName: employeeName.trim() || "Anônimo",
        results: categorizedResults,
        dominantFactor: dominantCategory || "Indefinido",
        categorizedResults
      };
    } else {
      const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
      
      return {
        templateId: template.id,
        employeeName: employeeName.trim() || "Anônimo",
        results: { totalScore },
        dominantFactor: "Personalizado"
      };
    }
  };

  const handleSubmit = () => {
    const result = calculateResults();
    onSubmit(result);
  };

  const adaptQuestionForDisplay = (question: ChecklistQuestion) => {
    if ('targetFactor' in question) {
      return question as DiscQuestion;
    } else {
      return {
        ...question,
        targetFactor: DiscFactorType.D,
        weight: 1
      } as DiscQuestion;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          {!isLastQuestion ? (
            currentQuestion && (
              <QuestionStep
                question={adaptQuestionForDisplay(currentQuestion)}
                currentStep={currentStep}
                totalSteps={template.questions.length}
                selectedValue={responses[currentQuestion.id]?.toString()}
                onResponseChange={handleResponseChange}
                scaleType={template.scaleType}
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
