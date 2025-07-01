
import { useState } from "react";
import { ChecklistTemplate, PsicossocialQuestion } from "@/types/checklist";
import { toast } from "sonner";
import { calculatePsicossocialRisk, PSICOSSOCIAL_CATEGORIES } from "@/services/checklist/templateUtils";

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

  console.log(`[usePsicossocialAssessment] Template: ${template.title}, Perguntas: ${questions.length}`);

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
      console.log("[usePsicossocialAssessment] Iniciando cálculo de risco...");
      
      // Calcular scores usando a nova função de análise
      const riskAnalysis = calculatePsicossocialRisk(responses, questions);
      
      console.log("[usePsicossocialAssessment] Análise de risco concluída:", riskAnalysis);
      
      // Preparar dados detalhados para o resultado
      const resultData = {
        templateId: template.id,
        employeeName: "Funcionário", // Será preenchido pelo sistema
        responses,
        results: riskAnalysis.categoryScores,
        dominantFactor: riskAnalysis.riskLevel,
        categorizedResults: riskAnalysis.categoryScores,
        factorsScores: riskAnalysis.categoryScores,
        riskAnalysis: {
          overallRisk: riskAnalysis.overallRisk,
          riskLevel: riskAnalysis.riskLevel,
          criticalCategories: riskAnalysis.criticalCategories,
          categoryBreakdown: Object.entries(riskAnalysis.categoryScores).map(([category, score]) => ({
            category: PSICOSSOCIAL_CATEGORIES[category as keyof typeof PSICOSSOCIAL_CATEGORIES] || category,
            score,
            riskLevel: score >= 80 ? 'crítico' : score >= 60 ? 'alto' : score >= 40 ? 'médio' : 'baixo'
          }))
        }
      };

      console.log("Enviando resultado psicossocial detalhado:", resultData);
      await onSubmit(resultData);
      
      // Mostrar resumo dos resultados
      toast.success(`Avaliação concluída! Risco geral: ${riskAnalysis.riskLevel.toUpperCase()}`);
      
      if (riskAnalysis.criticalCategories.length > 0) {
        toast.warning(`Atenção: Categorias críticas identificadas: ${riskAnalysis.criticalCategories.join(', ')}`);
      }
      
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
