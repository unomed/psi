
import { useState } from "react";
import { ChecklistTemplateWorkflow } from "@/components/checklists/ChecklistTemplateWorkflow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { useTemplatesPage } from "@/hooks/useTemplatesPage";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { toast } from "sonner";

// Componentes refatorados
import { TemplatesHeader } from "@/components/templates/TemplatesHeader";
import { TemplatesFilters } from "@/components/templates/TemplatesFilters";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";
import { TemplatesEmptyState } from "@/components/templates/TemplatesEmptyState";

export default function Templates() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const {
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
    hasActiveFilters
  } = useTemplatesPage();

  const { handleCreateTemplate, isLoading: isCreatingTemplate } = useChecklistTemplates();

  const validateTemplateSelection = (templateId: string): boolean => {
    setValidationErrors({});
    
    const template = filteredTemplates.find(t => t.id === templateId);
    if (!template) {
      setValidationErrors({ template: "Template não encontrado" });
      return false;
    }

    if (!template.questions || template.questions.length === 0) {
      setValidationErrors({ template: "Template não possui perguntas válidas" });
      return false;
    }

    return true;
  };

  const handleTemplateSelectionWithValidation = (templateId: string) => {
    if (!validateTemplateSelection(templateId)) {
      toast.error("Erro na validação do template");
      return;
    }

    handleDirectTemplateSelection(templateId);
  };

  const handleSubmitTemplate = async (templateData: any) => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validação dos dados do template
      if (!templateData.title || templateData.title.trim() === "") {
        setValidationErrors({ title: "Título é obrigatório" });
        return;
      }

      if (!templateData.questions || templateData.questions.length === 0) {
        setValidationErrors({ questions: "Template deve ter pelo menos uma pergunta" });
        return;
      }

      console.log("🔄 Iniciando criação de template:", templateData.title);
      
      const success = await handleCreateTemplate(templateData);
      
      if (success) {
        handleCloseDialog();
        toast.success("✅ Template criado com sucesso!", {
          description: `O template "${templateData.title}" está pronto para uso.`
        });
        console.log("✅ Template criado com sucesso:", templateData.title);
      } else {
        throw new Error("Falha na criação do template");
      }
    } catch (error) {
      console.error("❌ Erro ao criar template:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("❌ Erro ao criar template", {
        description: errorMessage
      });
      setValidationErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <TemplatesHeader
          onCreateFromScratch={handleCreateFromScratch}
          isSubmitting={isSubmitting}
          isCreatingTemplate={isCreatingTemplate}
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

        {/* Erros de validação globais */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>Erro de validação: {Object.values(validationErrors)[0]}</span>
          </div>
        )}

        {/* Templates Grid */}
        {filteredTemplates.length === 0 && !isCreatingTemplate ? (
          <TemplatesEmptyState
            onCreateFromScratch={handleCreateFromScratch}
            isCreatingTemplate={isCreatingTemplate}
          />
        ) : (
          <TemplatesGrid
            templates={filteredTemplates}
            onTemplateSelect={handleTemplateSelectionWithValidation}
            isSubmitting={isSubmitting}
            isCreatingTemplate={isCreatingTemplate}
          />
        )}

        {/* Dialog Workflow */}
        <ChecklistTemplateWorkflow
          isOpen={isCreateDialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitTemplate}
          existingTemplate={selectedTemplate}
          isEditing={false}
        />
      </div>
    </TooltipProvider>
  );
}
