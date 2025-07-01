
import { ExtendedTemplate } from "@/hooks/assessment-scheduling/useTemplateSelectionLogic";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";
import { TemplatesEmptyState } from "@/components/templates/TemplatesEmptyState";
import { toast } from "sonner";

interface AllTemplatesSectionProps {
  filteredTemplates: ExtendedTemplate[];
  customTemplatesCount: number;
  onTemplateSelect: (templateId: string) => void;
  isConverting: boolean;
}

export function AllTemplatesSection({
  filteredTemplates,
  customTemplatesCount,
  onTemplateSelect,
  isConverting
}: AllTemplatesSectionProps) {
  const handleCreateFromScratch = () => {
    toast.info("Para criar templates personalizados, vá para a página Templates");
  };

  if (filteredTemplates.length === 0) {
    return (
      <TemplatesEmptyState
        onCreateFromScratch={handleCreateFromScratch}
        isCreatingTemplate={false}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Todos os Templates ({filteredTemplates.length})
        </h3>
        <div className="text-sm text-muted-foreground">
          {customTemplatesCount > 0 && (
            <span>Incluindo {customTemplatesCount} template(s) personalizado(s)</span>
          )}
        </div>
      </div>
      <TemplatesGrid
        templates={filteredTemplates}
        onTemplateSelect={onTemplateSelect}
        isSubmitting={isConverting}
        isCreatingTemplate={false}
      />
    </div>
  );
}
