
import { useState, useMemo, useCallback } from "react";
import { createTemplateFromId } from "@/utils/templateIntegration";
import { STANDARD_QUESTIONNAIRE_TEMPLATES } from "@/data/standardQuestionnaires";
import { toast } from "sonner";

export function useTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filtros disponíveis com memoização para performance
  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(
      STANDARD_QUESTIONNAIRE_TEMPLATES.map(template => {
        if (template.id.includes("disc")) return "DISC";
        if (template.id.includes("psicossocial") || template.id.includes("estresse") || 
            template.id.includes("ambiente") || template.id.includes("organizacao")) return "Psicossocial";
        if (template.id.includes("360")) return "360°";
        if (template.id.includes("personal")) return "Vida Pessoal";
        return "Saúde Mental";
      })
    ));
    return ["all", ...types];
  }, []);

  // Templates filtrados com otimização de performance
  const filteredTemplates = useMemo(() => {
    let templates = STANDARD_QUESTIONNAIRE_TEMPLATES;

    // Filtro por busca - otimizado para busca em múltiplos campos
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
        const typeLabel = template.id.includes("disc") ? "DISC" :
                         template.id.includes("psicossocial") || template.id.includes("estresse") || 
                         template.id.includes("ambiente") || template.id.includes("organizacao") ? "Psicossocial" :
                         template.id.includes("360") ? "360°" :
                         template.id.includes("personal") ? "Vida Pessoal" : "Saúde Mental";
        return typeLabel === filterType;
      });
    }

    return templates;
  }, [searchTerm, filterType]);

  // Seleção direta de template com validação melhorada
  const handleDirectTemplateSelection = useCallback(async (templateId: string) => {
    setIsLoading(true);
    
    try {
      console.log("🔄 Carregando template:", templateId);
      
      // Validar se o template existe
      const templateExists = STANDARD_QUESTIONNAIRE_TEMPLATES.find(t => t.id === templateId);
      if (!templateExists) {
        throw new Error(`Template ${templateId} não encontrado`);
      }

      // Criar template com validação
      const template = createTemplateFromId(templateId);
      if (!template) {
        throw new Error(`Erro ao criar template ${templateId}`);
      }

      // Validar estrutura do template
      if (!template.questions || template.questions.length === 0) {
        throw new Error(`Template ${templateId} não possui perguntas válidas`);
      }

      console.log("✅ Template carregado com sucesso:", {
        id: template.id,
        title: template.title,
        questions: template.questions.length,
        type: template.type
      });

      setSelectedTemplate(template);
      setIsCreateDialogOpen(true);
      
      toast.success(`Template "${template.title}" carregado com sucesso!`);
      
    } catch (error) {
      console.error("❌ Erro ao carregar template:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      
      toast.error("Erro ao carregar template", {
        description: errorMessage
      });
      
      // Limpar estado em caso de erro
      setSelectedTemplate(null);
      setIsCreateDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar do zero com loading state
  const handleCreateFromScratch = useCallback(() => {
    console.log("🔄 Iniciando criação do zero");
    setSelectedTemplate(null);
    setIsCreateDialogOpen(true);
    toast.info("Iniciando criação de questionário personalizado");
  }, []);

  // Fechar dialog com limpeza de estado
  const handleCloseDialog = useCallback(() => {
    console.log("🔄 Fechando dialog de criação");
    setIsCreateDialogOpen(false);
    setSelectedTemplate(null);
    setIsLoading(false);
  }, []);

  // Limpar filtros com feedback
  const clearFilters = useCallback(() => {
    console.log("🔄 Limpando filtros");
    setSearchTerm("");
    setFilterType("all");
    toast.info("Filtros removidos");
  }, []);

  // Validação de template
  const validateTemplate = useCallback((template: any): boolean => {
    if (!template) {
      console.error("❌ Template é nulo ou undefined");
      return false;
    }

    if (!template.title || template.title.trim() === "") {
      console.error("❌ Template sem título válido");
      return false;
    }

    if (!template.questions || !Array.isArray(template.questions) || template.questions.length === 0) {
      console.error("❌ Template sem perguntas válidas");
      return false;
    }

    console.log("✅ Template validado com sucesso:", template.title);
    return true;
  }, []);

  return {
    // Estados
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    selectedTemplate,
    isCreateDialogOpen,
    isLoading,
    filteredTemplates,
    availableTypes,
    
    // Ações
    handleDirectTemplateSelection,
    handleCreateFromScratch,
    handleCloseDialog,
    clearFilters,
    validateTemplate,
    
    // Computed properties
    hasActiveFilters: searchTerm !== "" || filterType !== "all",
    totalTemplates: STANDARD_QUESTIONNAIRE_TEMPLATES.length,
    filteredCount: filteredTemplates.length
  };
}
