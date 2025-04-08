
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  ChecklistTemplate, 
  ChecklistResult, 
  DiscFactorType 
} from "@/types/checklist";
import { Card, CardContent } from "@/components/ui/card";

interface DiscAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (result: Omit<ChecklistResult, "id" | "completedAt">) => void;
  onCancel: () => void;
}

interface QuestionResponse {
  questionId: string;
  value: number;
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

  const handleSubmit = () => {
    // Calculate results
    const factorScores = {
      D: 0,
      I: 0,
      S: 0,
      C: 0
    };
    
    let totalWeight = 0;
    
    // Calculate weighted scores for each factor
    template.questions.forEach(question => {
      const response = responses[question.id] || 0;
      const weightedResponse = response * question.weight;
      
      factorScores[question.targetFactor] += weightedResponse;
      totalWeight += question.weight;
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
    
    // Submit result
    onSubmit({
      templateId: template.id,
      employeeName: employeeName.trim() || "Anônimo",
      results: factorScores,
      dominantFactor
    });
  };

  return (
    <div className="space-y-6">
      {!isLastQuestion ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Questão {currentStep + 1} de {template.questions.length}</h3>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((currentStep / template.questions.length) * 100)}% completo
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(currentStep / template.questions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <p className="text-base">{currentQuestion?.text}</p>
              
              <RadioGroup 
                value={responses[currentQuestion?.id || ""] ? 
                  responses[currentQuestion?.id || ""].toString() : undefined}
                onValueChange={handleResponseChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="r1" />
                  <Label htmlFor="r1">Discordo totalmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="r2" />
                  <Label htmlFor="r2">Discordo parcialmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="r3" />
                  <Label htmlFor="r3">Neutro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="r4" />
                  <Label htmlFor="r4">Concordo parcialmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="r5" />
                  <Label htmlFor="r5">Concordo totalmente</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Final step - collect employee name
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Concluir Avaliação</h3>
              <p>
                Você respondeu todas as {template.questions.length} questões. 
                Para finalizar, informe seu nome ou deixe em branco para uma avaliação anônima.
              </p>
              <div className="space-y-2">
                <Label htmlFor="employee-name">Nome (opcional)</Label>
                <Input 
                  id="employee-name"
                  placeholder="Seu nome"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between">
        {currentStep > 0 ? (
          <Button type="button" variant="outline" onClick={handlePrevious}>
            Anterior
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        
        {!isLastQuestion ? (
          <Button 
            type="button" 
            onClick={handleNext}
            disabled={responses[currentQuestion?.id || ""] === undefined}
          >
            Próxima
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit}>
            Finalizar Avaliação
          </Button>
        )}
      </div>
    </div>
  );
}
