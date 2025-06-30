
import { useState, useMemo } from "react";
import { ChecklistTemplate, PsicossocialQuestion } from "@/types";
import { toast } from "sonner";

interface UsePsicossocialAssessmentProps {
  template: ChecklistTemplate;
  onSubmit: (data: any) => void;
}

export function usePsicossocialAssessment({ template, onSubmit }: UsePsicossocialAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = template.questions as PsicossocialQuestion[];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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

  return {
    currentQuestionIndex,
    currentQuestion,
    responses,
    isSubmitting,
    progress,
    questions,
    handleResponseChange,
    handleNext,
    handlePrevious,
    handleSubmit
  };
}
