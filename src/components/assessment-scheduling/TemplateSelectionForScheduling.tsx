
import { useState, useMemo } from "react";
import { ChecklistTemplate } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createTemplateFromId } from "@/utils/templateIntegration";
import { useTemplatesPage } from "@/hooks/useTemplatesPage";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { FavoriteTemplatesSection } from "@/components/templates/FavoriteTemplatesSection";
import { TemplatesFilters } from "@/components/templates/TemplatesFilters";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";
import { TemplatesEmptyState } from "@/components/templates/TemplatesEmptyState";
import { ScaleType } from "@/types";
import { toast } from "sonner";

interface TemplateSelectionForSchedulingProps {
  onTemplateSelect: (template: ChecklistTemplate) => void;
  onBack: () => void;
  selectedTemplate: ChecklistTemplate | null;
}

// Interface estendida para templates com propriedades customizadas
interface ExtendedTemplate {
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

export function TemplateSelectionForScheduling({
  onTemplateSelect,
  onBack,
  selectedTemplate
}: TemplateSelectionForSchedulingProps) {
  const [isConverting, setIsConverting] = useState(false);

  // Hook para templates padrão
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    clearFilters,
    hasActiveFilters,
    validateTemplate
  } = useTemplatesPage();

  // Hook para templates customizados do banco
  const { checklists: customTemplates, isLoading: isLoadingCustom } = useChecklistTemplates();

  // Combinar templates padrão e customizados
  const allTemplates = useMemo((): ExtendedTemplate[] => {
    const standardTemplates = useTemplatesPage().filteredTemplates;
    
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
      estimatedQuestions: template.estimatedQuestions,
      estimatedTimeMinutes: template.estimatedTimeMinutes,
      typeLabel: template.typeLabel
    }));

    return [...convertedStandardTemplates, ...convertedCustomTemplates];
  }, [customTemplates]);

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

  const handleTemplateSelection = async (templateId: string) => {
    setIsConverting(true);
    
    try {
      console.log("🔄 Convertendo template para agendamento:", templateId);
      
      let template: ChecklistTemplate | null = null;

      // Verificar se é template customizado
      const customTemplate = customTemplates.find(t => t.id === templateId);
      if (customTemplate) {
        console.log("✅ Template customizado encontrado:", customTemplate.title);
        template = customTemplate;
      } else {
        // Template padrão - usar createTemplateFromId
        const standardTemplate = createTemplateFromId(templateId);
        if (!standardTemplate) {
          throw new Error(`Template padrão ${templateId} não encontrado`);
        }

        // Converter para ChecklistTemplate
        template = {
          id: standardTemplate.id,
          title: standardTemplate.title,
          description: standardTemplate.description || '',
          type: standardTemplate.type,
          questions: standardTemplate.questions || [],
          createdAt: new Date(),
          scaleType: standardTemplate.scaleType || ScaleType.Likert,
          isStandard: true,
          estimatedTimeMinutes: standardTemplate.estimatedTimeMinutes,
          instructions: standardTemplate.instructions,
          interpretationGuide: standardTemplate.interpretationGuide,
          maxScore: standardTemplate.maxScore,
          cutoffScores: standardTemplate.cutoffScores,
          isActive: true,
          version: 1,
          // Database compatibility fields
          estimated_time_minutes: standardTemplate.estimatedTimeMinutes,
          is_standard: true,
          scale_type: standardTemplate.scaleType || 'likert5',
          created_at: new Date().toISOString(),
          is_active: true,
          cutoff_scores: standardTemplate.cutoffScores,
          max_score: standardTemplate.maxScore,
          interpretation_guide: standardTemplate.interpretationGuide
        };
      }

      // Validar template
      if (!validateTemplate(template)) {
        throw new Error(`Template ${templateId} não é válido`);
      }

      console.log("✅ Template convertido com sucesso:", {
        id: template.id,
        title: template.title,
        questions: template.questions.length,
        type: template.type,
        isCustom: !!customTemplate
      });

      onTemplateSelect(template);
      toast.success(`Template "${template.title}" selecionado para agendamento!`);
      
    } catch (error) {
      console.error("❌ Erro ao converter template:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao selecionar template", {
        description: errorMessage
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleCreateFromScratch = () => {
    toast.info("Para criar templates personalizados, vá para a página Templates");
  };

  if (isLoadingCustom) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Selecionar Template de Avaliação</h2>
          <p className="text-muted-foreground">
            Escolha um template para criar a avaliação agendada (Templates padrão + seus templates customizados)
          </p>
        </div>
      </div>

      {/* Seção de Favoritos */}
      <FavoriteTemplatesSection
        onTemplateSelect={handleTemplateSelection}
        isSubmitting={isConverting}
        isCreatingTemplate={false}
      />

      {/* Filtros e Busca */}
      <TemplatesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        availableTypes={availableTypes}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        filteredTemplates={filteredTemplates}
      />

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <TemplatesEmptyState
          onCreateFromScratch={handleCreateFromScratch}
          isCreatingTemplate={false}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Todos os Templates ({filteredTemplates.length})
            </h3>
            <div className="text-sm text-muted-foreground">
              {customTemplates.length > 0 && (
                <span>Incluindo {customTemplates.length} template(s) personalizado(s)</span>
              )}
            </div>
          </div>
          <TemplatesGrid
            templates={filteredTemplates}
            onTemplateSelect={handleTemplateSelection}
            isSubmitting={isConverting}
            isCreatingTemplate={false}
          />
        </div>
      )}

      {/* Template Selecionado */}
      {selectedTemplate && (
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-lg text-primary">
              Template Selecionado: {selectedTemplate.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedTemplate.description}
            </p>
            <div className="flex gap-4 text-sm">
              <span>Perguntas: {selectedTemplate.questions?.length || 0}</span>
              <span>Tempo: {selectedTemplate.estimatedTimeMinutes} min</span>
              <span>Tipo: {selectedTemplate.type}</span>
              {selectedTemplate.isStandard === false && (
                <span className="text-blue-600 font-medium">Personalizado</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
