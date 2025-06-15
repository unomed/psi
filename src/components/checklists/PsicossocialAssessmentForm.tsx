
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChecklistTemplate, PsicossocialQuestion } from "@/types";
import { toast } from "sonner";

interface PsicossocialAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PsicossocialAssessmentForm({ template, onSubmit, onCancel }: PsicossocialAssessmentFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assumir que todas as questões são do tipo psicossocial
  const questions = template.questions as PsicossocialQuestion[];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Opções de resposta padrão para questionários psicossociais
  const responseOptions = [
    { value: 1, label: "Nunca" },
    { value: 2, label: "Raramente" },
    { value: 3, label: "Às vezes" },
    { value: 4, label: "Frequentemente" },
    { value: 5, label: "Sempre" }
  ];

  const handleResponseChange = (value: string) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: parseInt(value)
    });
  };

  const handleNext = () => {
    if (!responses[currentQuestion.id]) {
      toast.error("Por favor, selecione uma resposta antes de continuar.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length !== questions.length) {
      toast.error("Por favor, responda todas as perguntas.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calcular scores por categoria
      const categorizedResults = calculateCategoryScores(responses);
      
      // Determinar categoria dominante (maior score)
      const dominantCategory = Object.entries(categorizedResults)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      const resultData = {
        templateId: template.id,
        employeeName: "Funcionário", // Será preenchido pelo sistema
        responses,
        results: categorizedResults,
        dominantFactor: dominantCategory,
        categorizedResults,
        factorsScores: categorizedResults
      };

      console.log("Enviando resultado:", resultData);
      await onSubmit(resultData);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateCategoryScores = (responses: Record<string, number>) => {
    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    questions.forEach(question => {
      const category = question.category || "Geral";
      const response = responses[question.id] || 0;

      if (!categoryScores[category]) {
        categoryScores[category] = 0;
        categoryCounts[category] = 0;
      }

      categoryScores[category] += response;
      categoryCounts[category]++;
    });

    // Calcular média por categoria e converter para escala 0-100
    Object.keys(categoryScores).forEach(category => {
      const average = categoryScores[category] / categoryCounts[category];
      categoryScores[category] = Math.round((average / 5) * 100); // Converter escala 1-5 para 0-100
    });

    return categoryScores;
  };

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
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {template.title}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Pergunta Atual */}
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium text-lg mb-2">
                {currentQuestion.text}
              </h3>
              {currentQuestion.category && (
                <span className="text-sm text-muted-foreground">
                  Categoria: {currentQuestion.category}
                </span>
              )}
            </div>

            {/* Opções de Resposta */}
            <RadioGroup 
              value={responses[currentQuestion.id]?.toString() || ""} 
              onValueChange={handleResponseChange}
              className="space-y-3"
            >
              {responseOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Botões de Navegação */}
          <div className="flex justify-between pt-4">
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
                disabled={!responses[currentQuestion.id] || isSubmitting}
              >
                {currentQuestionIndex === questions.length - 1 
                  ? (isSubmitting ? "Enviando..." : "Finalizar")
                  : "Próxima"
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
