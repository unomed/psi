
import { useState, useMemo } from "react";
import { getTemplatePreview, createTemplateFromId, searchTemplates, getTemplatesByType } from "@/utils/templateIntegration";
import { STANDARD_QUESTIONNAIRE_TEMPLATES } from "@/data/standardQuestionnaires";
import { toast } from "sonner";

export function useTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filtros disponíveis
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

  // Templates filtrados
  const filteredTemplates = useMemo(() => {
    let templates = STANDARD_QUESTIONNAIRE_TEMPLATES;

    // Filtro por busca
    if (searchTerm) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.categories || []).some(cat => 
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
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

  // Seleção direta de template
  const handleDirectTemplateSelection = (templateId: string) => {
    const template = createTemplateFromId(templateId);
    if (template) {
      setSelectedTemplate(template);
      setIsCreateDialogOpen(true);
    } else {
      toast.error("Erro ao carregar template selecionado");
    }
  };

  // Criar do zero
  const handleCreateFromScratch = () => {
    setSelectedTemplate(null);
    setIsCreateDialogOpen(true);
  };

  // Fechar dialog
  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setSelectedTemplate(null);
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
  };

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    selectedTemplate,
    isCreateDialogOpen,
    filteredTemplates,
    availableTypes,
    handleDirectTemplateSelection,
    handleCreateFromScratch,
    handleCloseDialog,
    clearFilters,
    hasActiveFilters: searchTerm !== "" || filterType !== "all"
  };
}
