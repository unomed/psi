
import { ChecklistTemplate } from "@/types";
import { FavoriteTemplatesSection } from "@/components/templates/FavoriteTemplatesSection";
import { TemplatesFilters } from "@/components/templates/TemplatesFilters";
import { useTemplateSelectionLogic } from "@/hooks/assessment-scheduling/useTemplateSelectionLogic";
import { TemplateSelectionHeader } from "./template-selection/TemplateSelectionHeader";
import { SelectedTemplateCard } from "./template-selection/SelectedTemplateCard";
import { AllTemplatesSection } from "./template-selection/AllTemplatesSection";

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
  const {
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
  } = useTemplateSelectionLogic();

  const handleTemplateSelect = (templateId: string) => {
    handleTemplateSelection(templateId, onTemplateSelect);
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
      <TemplateSelectionHeader onBack={onBack} />

      {/* Seção de Favoritos */}
      <FavoriteTemplatesSection
        onTemplateSelect={handleTemplateSelect}
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
      <AllTemplatesSection
        filteredTemplates={filteredTemplates}
        customTemplatesCount={customTemplates.length}
        onTemplateSelect={handleTemplateSelect}
        isConverting={isConverting}
      />

      {/* Template Selecionado */}
      {selectedTemplate && (
        <SelectedTemplateCard selectedTemplate={selectedTemplate} />
      )}
    </div>
  );
}
