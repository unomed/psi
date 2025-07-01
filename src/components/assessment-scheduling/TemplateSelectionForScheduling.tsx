
import { useState } from "react";
import { ChecklistTemplate } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createTemplateFromId } from "@/utils/templateIntegration";
import { useTemplatesPage } from "@/hooks/useTemplatesPage";
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

export function TemplateSelectionForScheduling({
  onTemplateSelect,
  onBack,
  selectedTemplate
}: TemplateSelectionForSchedulingProps) {
  const [isConverting, setIsConverting] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filteredTemplates,
    availableTypes,
    clearFilters,
    hasActiveFilters,
    validateTemplate
  } = useTemplatesPage();

  const handleTemplateSelection = async (templateId: string) => {
    setIsConverting(true);
    
    try {
      console.log("🔄 Convertendo template para agendamento:", templateId);
      
      // Criar template a partir do ID
      const template = createTemplateFromId(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} não encontrado`);
      }

      // Validar template
      if (!validateTemplate(template)) {
        throw new Error(`Template ${templateId} não é válido`);
      }

      // Converter para ChecklistTemplate compatível com agendamento
      const checklistTemplate: ChecklistTemplate = {
        id: template.id,
        title: template.title,
        description: template.description || '',
        type: template.type,
        questions: template.questions || [],
        createdAt: new Date(),
        scaleType: template.scaleType || ScaleType.Likert,
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

      onTemplateSelect(checklistTemplate);
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
            Escolha um template para criar a avaliação agendada
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
          <h3 className="text-xl font-semibold">Todos os Templates</h3>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
