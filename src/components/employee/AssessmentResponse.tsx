import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate } from "@/types";
import { toast } from "sonner";

interface AssessmentResponseProps {
  templateId: string;
  employeeId: string;
  onComplete: () => void;
}

export function AssessmentResponse({ templateId, employeeId, onComplete }: AssessmentResponseProps) {
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) {
        console.error("Error fetching template:", error);
        toast.error("Erro ao carregar o questionário");
      }

      setTemplate(data as ChecklistTemplate);
    };

    fetchTemplate();
  }, [templateId]);

  const questions = template?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Calculate dominant factor (simplified for demonstration)
    const dominantFactor = "D";

    // Prepare result data
    const resultData = {
      templateId: templateId,
      employeeId: employeeId,
      employeeName: "Nome do Funcionário", // Replace with actual name
      results: responses,
      dominantFactor: dominantFactor
    };

    // Simulate saving the assessment result
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setCompleted(true);
    toast.success("Questionário concluído com sucesso!");
    onComplete();
  };

  const renderScaleOptions = () => {
    const scaleType = template?.scale_type;

    if (scaleType === 'likert_5' || scaleType === 'likert') {
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
    const scaleType = template?.scale_type;

    if (scaleType === 'psicossocial') {
      return "Indique com que frequência cada situação se aplica ao seu trabalho:";
    }

    return "Indique o seu nível de concordância com cada afirmação:";
  };

  if (!template) {
    return <p>Carregando questionário...</p>;
  }

  if (completed) {
    return (
      <div className="text-center p-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Questionário Concluído!</h3>
        <p className="text-muted-foreground mb-4">
          Obrigado por responder ao questionário.
        </p>
      </div>
    );
  }

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
          <Progress value={progress} />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <CardDescription className="mb-4">
              {getScaleDescription()}
            </CardDescription>

            <h3 className="text-lg font-medium mb-4">
              {currentQuestion?.question_text || currentQuestion?.text}
            </h3>

            <RadioGroup
              value={responses[currentQuestion?.id] || ""}
              onValueChange={(value) => handleResponseChange(currentQuestion?.id, value)}
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
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Finalizar"}
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!responses[currentQuestion?.id]}>
                Próxima
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
