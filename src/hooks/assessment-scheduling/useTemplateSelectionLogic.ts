
import { useState, useMemo } from "react";
import { ChecklistTemplate, ScaleType } from "@/types";
import { createTemplateFromId } from "@/utils/templateIntegration";
import { useTemplatesPage } from "@/hooks/useTemplatesPage";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Interface estendida para templates com propriedades customizadas
export interface ExtendedTemplate {
  id: string;
  name: string;
  description: string;
  categories: string[];
  estimatedQuestions: number;
  estimatedTimeMinutes: number;
  typeLabel: string;
  isCustom?: boolean;
  originalTemplate?: ChecklistTemplate;
}

export function useTemplateSelectionLogic() {
  const [isConverting, setIsConverting] = useState(false);

  // Hook para templates padrão
  const templatesPageData = useTemplatesPage();
  
  // Hook para templates customizados do banco
  const { checklists: customTemplates, isLoading: isLoadingCustom } = useChecklistTemplates();

  // Extrair funções de busca e filtro dos templates
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    clearFilters,
    hasActiveFilters,
    validateTemplate
  } = templatesPageData;

  // Função para gerar typeLabel baseado no template
  const generateTypeLabel = (template: any): string => {
    if (template.type) {
      // Para templates customizados que já têm type
      return template.type.toUpperCase();
    }
    
    // Para templates padrão, inferir do ID
    const id = template.id.toLowerCase();
    if (id.includes("disc")) return "DISC";
    if (id.includes("psicossocial") || id.includes("estresse") || id.includes("ambiente") || id.includes("organizacao")) return "Psicossocial";
    if (id.includes("360")) return "360°";
    if (id.includes("personal")) return "Vida Pessoal";
    return "Saúde Mental";
  };

  // Combinar templates padrão e customizados
  const allTemplates = useMemo((): ExtendedTemplate[] => {
    const standardTemplates = templatesPageData.filteredTemplates || [];
    
    // Converter templates customizados para formato compatível
    const convertedCustomTemplates: ExtendedTemplate[] = customTemplates.map(template => ({
      id: template.id,
      name: template.title,
      description: template.description || '',
      categories: [template.type],
      estimatedQuestions: template.questions?.length || 0,
      estimatedTimeMinutes: template.estimatedTimeMinutes || 30,
      typeLabel: template.type.toUpperCase(),
      isCustom: true,
      originalTemplate: template
    }));

    // Converter templates padrão para formato compatível
    const convertedStandardTemplates: ExtendedTemplate[] = standardTemplates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      categories: template.categories || [],
      estimatedQuestions: template.questions?.length || 0,
      estimatedTimeMinutes: template.estimatedTimeMinutes,
      typeLabel: generateTypeLabel(template)
    }));

    return [...convertedStandardTemplates, ...convertedCustomTemplates];
  }, [customTemplates, templatesPageData.filteredTemplates]);

  // Aplicar filtros nos templates combinados
  const filteredTemplates = useMemo(() => {
    let templates = allTemplates;

    // Filtro por busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      templates = templates.filter(template => {
        const searchableText = [
          template.name,
          template.description,
          ...(template.categories || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });
    }

    // Filtro por tipo
    if (filterType !== "all") {
      templates = templates.filter(template => {
        if (template.isCustom && template.originalTemplate) {
          // Para templates customizados, usar o tipo original
          return template.originalTemplate.type === filterType.toLowerCase();
        } else {
          // Para templates padrão, usar o typeLabel
          return template.typeLabel === filterType;
        }
      });
    }

    return templates;
  }, [allTemplates, searchTerm, filterType]);

  // Tipos disponíveis incluindo customizados
  const availableTypes = useMemo(() => {
    const standardTypes = ["all", "DISC", "Psicossocial", "360°", "Vida Pessoal", "Saúde Mental"];
    
    // Adicionar tipos dos templates customizados
    const customTypes = Array.from(new Set(
      customTemplates.map(t => t.type.toUpperCase())
    ));
    
    return [...standardTypes, ...customTypes.filter(type => !standardTypes.includes(type))];
  }, [customTemplates]);

  const handleTemplateSelection = async (templateId: string, onTemplateSelect: (template: ChecklistTemplate) => void) => {
    setIsConverting(true);
    
    try {
      console.log("🔄 Selecionando template para agendamento:", templateId);
      
      let template: ChecklistTemplate | null = null;

      // Primeiro, verificar se é template customizado (do banco de dados)
      const customTemplate = customTemplates.find(t => t.id === templateId);
      if (customTemplate) {
        console.log("✅ Template customizado encontrado:", customTemplate.title);
        template = customTemplate;
      } else {
        // Se não é template customizado, verificar se existe no banco de dados
        const { data: existingTemplate, error: fetchError } = await supabase
          .from('checklist_templates')
          .select(`
            *,
            questions(*)
          `)
          .eq('id', templateId)
          .single();

        if (existingTemplate && !fetchError) {
          console.log("✅ Template encontrado no banco:", existingTemplate.title);
          template = {
            id: existingTemplate.id,
            title: existingTemplate.title,
            description: existingTemplate.description || '',
            type: existingTemplate.type,
            questions: [] as any[], // Evitar problemas de tipo com as perguntas do banco
            createdAt: new Date(existingTemplate.created_at),
            scaleType: existingTemplate.scale_type as any,
            isStandard: existingTemplate.is_standard,
            estimatedTimeMinutes: existingTemplate.estimated_time_minutes,
            isActive: existingTemplate.is_active,
            interpretationGuide: existingTemplate.interpretation_guide,
            cutoffScores: existingTemplate.cutoff_scores,
            maxScore: existingTemplate.max_score,
            version: existingTemplate.version,
            // Database compatibility fields
            estimated_time_minutes: existingTemplate.estimated_time_minutes,
            is_standard: existingTemplate.is_standard,
            scale_type: existingTemplate.scale_type,
            created_at: existingTemplate.created_at,
            is_active: existingTemplate.is_active,
            cutoff_scores: existingTemplate.cutoff_scores,
            max_score: existingTemplate.max_score,
            interpretation_guide: existingTemplate.interpretation_guide
          };
        } else {
          // Template não encontrado no banco
          console.error("❌ Template não encontrado no banco de dados:", templateId);
          throw new Error(`Template "${templateId}" não foi encontrado. Use apenas templates salvos no sistema.`);
        }
      }

      // Validar template final
      if (!template || !template.id) {
        throw new Error(`Template ${templateId} não pôde ser processado`);
      }

      // Validação adicional usando a função validateTemplate se disponível
      if (validateTemplate && !validateTemplate(template)) {
        throw new Error(`Template ${templateId} não é válido`);
      }

      console.log("✅ Template selecionado com sucesso:", {
        id: template.id,
        title: template.title,
        questions: template.questions?.length || 0,
        type: template.type,
        isCustom: !!customTemplate,
        existsInDb: true
      });

      onTemplateSelect(template);
      toast.success(`Template "${template.title}" selecionado para agendamento!`);
      
    } catch (error) {
      console.error("❌ Erro ao selecionar template:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao selecionar template", {
        description: errorMessage
      });
    } finally {
      setIsConverting(false);
    }
  };

  return {
    isConverting,
    isLoadingCustom,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    clearFilters,
    hasActiveFilters,
    filteredTemplates,
    availableTypes,
    customTemplates,
    handleTemplateSelection
  };
}
