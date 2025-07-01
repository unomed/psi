
import { useState, useCallback } from "react";
import { ChecklistTemplate } from "@/types";
import { createTemplateFromId } from "@/utils/templateIntegration";
import { useTemplateAnalytics } from "@/hooks/useTemplateAnalytics";
import { toast } from "sonner";

export function useTemplateSelection() {
  const [isConverting, setIsConverting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const { trackTemplateSelect } = useTemplateAnalytics();

  const convertTemplateForScheduling = useCallback(async (templateId: string): Promise<ChecklistTemplate | null> => {
    setIsConverting(true);
    
    try {
      console.log("🔄 Convertendo template para agendamento:", templateId);
      
      // Criar template a partir do ID
      const template = createTemplateFromId(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} não encontrado`);
      }

      // Validar estrutura do template
      if (!template.questions || template.questions.length === 0) {
        throw new Error(`Template ${templateId} não possui perguntas válidas`);
      }

      // Registrar analytics
      trackTemplateSelect(templateId, template.type);

      // Converter para ChecklistTemplate compatível com agendamento
      const checklistTemplate: ChecklistTemplate = {
        id: template.id,
        title: template.title,
        description: template.description || '',
        type: template.type,
        questions: template.questions,
        createdAt: new Date(),
        scaleType: template.scaleType || 'likert5',
        isStandard: true,
        estimatedTimeMinutes: template.estimatedTimeMinutes,
        instructions: template.instructions,
        interpretationGuide: template.interpretationGuide,
        maxScore: template.maxScore,
        cutoffScores: template.cutoffScores,
        isActive: true,
        version: 1,
        // Database compatibility fields
        estimated_time_minutes: template.estimatedTimeMinutes,
        is_standard: true,
        scale_type: template.scaleType || 'likert5',
        created_at: new Date().toISOString(),
        is_active: true,
        cutoff_scores: template.cutoffScores,
        max_score: template.maxScore,
        interpretation_guide: template.interpretationGuide
      };

      console.log("✅ Template convertido com sucesso:", {
        id: checklistTemplate.id,
        title: checklistTemplate.title,
        questions: checklistTemplate.questions.length,
        type: checklistTemplate.type
      });

      setSelectedTemplate(checklistTemplate);
      return checklistTemplate;
      
    } catch (error) {
      console.error("❌ Erro ao converter template:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao selecionar template", {
        description: errorMessage
      });
      return null;
    } finally {
      setIsConverting(false);
    }
  }, [trackTemplateSelect]);

  const clearSelection = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  return {
    selectedTemplate,
    isConverting,
    convertTemplateForScheduling,
    clearSelection
  };
}
