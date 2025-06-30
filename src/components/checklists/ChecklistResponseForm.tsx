
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChecklistTemplate } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ChecklistResponseFormProps {
  template: ChecklistTemplate;
  onSubmit: (responses: Record<string, any>) => void;
  onCancel: () => void;
}

export function ChecklistResponseForm({ 
  template, 
  onSubmit, 
  onCancel 
}: ChecklistResponseFormProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = template.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Questionário não disponível</h3>
        <p className="text-muted-foreground mb-4">
          Este questionário não possui perguntas configuradas.
        </p>
        <Button onClick={onCancel}>Voltar</Button>
      </div>
    );
  }

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onSubmit(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const renderScaleOptions = () => {
    const scaleType = template.scale_type;
    
    if (scaleType === 'likert5' || scaleType === 'likert') {
      return [
        { value: "1", label: "1 - Discordo totalmente" },
        { value: "2", label: "2 - Discordo parcialmente" },
        { value: "3", label: "3 - Neutro" },
        { value: "4", label: "4 - Concordo parcialmente" },
        { value: "5", label: "5 - Concordo totalmente" }
      ];
    } else if (scaleType === 'binary' || scaleType === 'yes_no') {
      return [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" }
      ];
    } else if (scaleType === 'psicossocial') {
      return [
        { value: "1", label: "1 - Nunca/Quase nunca" },
        { value: "2", label: "2 - Raramente" },
        { value: "3", label: "3 - Às vezes" },
        { value: "4", label: "4 - Frequentemente" },
        { value: "5", label: "5 - Sempre/Quase sempre" }
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

  const getScaleDescription = () => {
    const scaleType = template.scale_type;
    
    if (scaleType === 'psicossocial') {
      return "Indique com que frequência cada situação se aplica ao seu trabalho:";
    }
    
    return "Indique o seu nível de concordância com cada afirmação:";
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>{template.name || template.title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} de {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <CardDescription className="mb-4">
              {getScaleDescription()}
            </CardDescription>
            
            <h3 className="text-lg font-medium mb-4">
              {currentQuestion.question_text || currentQuestion.text}
            </h3>

            {/* Scale-specific rendering */}
            {template.scale_type === "likert5" ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Selecione uma opção de 1 (Discordo totalmente) a 5 (Concordo totalmente)
                </p>
                <RadioGroup
                  value={responses[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) => handleResponseChange(currentQuestion.id, parseInt(value))}
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`${currentQuestion.id}-${value}`} />
                      <Label htmlFor={`${currentQuestion.id}-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : template.scale_type === "yes_no" ? (
              <RadioGroup
                value={responses[currentQuestion.id]?.toString() || ""}
                onValueChange={(value) => handleResponseChange(currentQuestion.id, value === "yes" ? 1 : 0)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${currentQuestion.id}-yes`} />
                  <Label htmlFor={`${currentQuestion.id}-yes`}>Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${currentQuestion.id}-no`} />
                  <Label htmlFor={`${currentQuestion.id}-no`}>Não</Label>
                </div>
              </RadioGroup>
            ) : (
              <RadioGroup
                value={responses[currentQuestion.id] || ""}
                onValueChange={(value) => handleResponseChange(currentQuestion.id, value)}
              >
                {renderScaleOptions().map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!responses[currentQuestion.id]}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
