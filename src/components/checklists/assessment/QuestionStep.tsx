import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChecklistTemplate, Question, SCALE_TYPES } from "@/types";

interface QuestionStepProps {
  template: ChecklistTemplate;
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  response: string;
  onResponseChange: (response: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion: boolean;
}

export function QuestionStep({
  template,
  question,
  questionIndex,
  totalQuestions,
  response,
  onResponseChange,
  onNext,
  onPrevious,
  isLastQuestion
}: QuestionStepProps) {

  const getScaleOptions = () => {
    const scaleType = template.scale_type;
    
    if (scaleType === 'likert_5') {  // ✅ usar string literal
      return [
        { value: "1", label: "1 - Discordo totalmente" },
        { value: "2", label: "2 - Discordo parcialmente" },
        { value: "3", label: "3 - Neutro" },
        { value: "4", label: "4 - Concordo parcialmente" },
        { value: "5", label: "5 - Concordo totalmente" }
      ];
    } else if (scaleType === 'binary' || scaleType === 'yes_no') {  // ✅ usar string literals
      return [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" }
      ];
    } else if (scaleType === 'psicossocial') {  // ✅ usar string literal
      return [
        { value: "1", label: "1 - Nunca/Quase nunca" },
        { value: "2", label: "2 - Raramente" },
        { value: "3", label: "3 - Às vezes" },
        { value: "4", label: "4 - Frequentemente" },
        { value: "5", label: "5 - Sempre/Quase sempre" }
      ];
    } else if (scaleType === 'likert_7') {  // ✅ usar string literal
      return [
        { value: "1", label: "1 - Discordo totalmente" },
        { value: "2", label: "2 - Discordo muito" },
        { value: "3", label: "3 - Discordo parcialmente" },
        { value: "4", label: "4 - Neutro" },
        { value: "5", label: "5 - Concordo parcialmente" },
        { value: "6", label: "6 - Concordo muito" },
        { value: "7", label: "7 - Concordo totalmente" }
      ];
    } else if (scaleType === 'numeric') {  // ✅ usar string literal
      return [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" }
      ];
    }
    
    // Default fallback
    return [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" }
    ];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Questão {questionIndex + 1} de {totalQuestions}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {question.question_text || question.text}
          </h3>

          <RadioGroup
            value={response}
            onValueChange={onResponseChange}
          >
            {getScaleOptions().map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={questionIndex === 0}
          >
            Anterior
          </Button>
          
          <Button 
            onClick={onNext}
            disabled={!response}
          >
            {isLastQuestion ? 'Finalizar' : 'Próxima'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
