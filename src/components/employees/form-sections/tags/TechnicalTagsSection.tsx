
import { FormLabel } from "@/components/ui/form";
import { useEmployeeTags, useTagTypes } from "@/hooks/useEmployeeTags";
import { useRoleRequiredTags } from "@/hooks/useRoleRequiredTags";
import { AddTagDialog } from "./AddTagDialog";
import { MissingRequiredTags } from "./MissingRequiredTags";
import { CurrentTagsList } from "./CurrentTagsList";
import { TagSystemDebug } from "./TagSystemDebug";
import { TagMigrationStatus } from "./TagMigrationStatus";
import { TagSystemErrorBoundary } from "./TagSystemErrorBoundary";
import { AdvancedTagsManager } from "./AdvancedTagsManager";
import { TagSystemStatusIndicators } from "./TagSystemStatusIndicators";
import { TagModeToggle } from "./TagModeToggle";
import { TagDebugSection } from "./TagDebugSection";
import { TagSystemWarnings } from "./TagSystemWarnings";
import { AssessmentIntegration } from "./AssessmentIntegration";
import { useState } from "react";

interface TechnicalTagsSectionProps {
  employeeId?: string;
  selectedRole: string | null;
  onTagsChange?: (tags: string[]) => void;
}

export function TechnicalTagsSection({ employeeId, selectedRole, onTagsChange }: TechnicalTagsSectionProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
  const [showAssessmentIntegration, setShowAssessmentIntegration] = useState(false);
  
  const { employeeTags, isLoading: isLoadingEmployeeTags } = useEmployeeTags(employeeId);
  const { tagTypes, isLoading: isLoadingTagTypes } = useTagTypes();
  const { requiredTags, isLoading: isLoadingRequiredTags } = useRoleRequiredTags(selectedRole);

  console.log("[TechnicalTagsSection] Estado atual:", {
    employeeId,
    selectedRole,
    employeeTagsCount: employeeTags.length,
    tagTypesCount: tagTypes.length,
    requiredTagsCount: requiredTags.length,
    isLoading: { employeeTags: isLoadingEmployeeTags, tagTypes: isLoadingTagTypes, requiredTags: isLoadingRequiredTags },
    advancedMode: useAdvancedMode
  });

  const currentTagIds = employeeTags.map(t => t.tag_type_id);
  const availableTagTypes = tagTypes.filter(t => !currentTagIds.includes(t.id));
  
  const missingRequiredTags = requiredTags.filter(
    rt => !currentTagIds.includes(rt.tag_type_id)
  );

  const handleTagsChanged = () => {
    console.log("[TechnicalTagsSection] Tags alteradas, atualizando...");
    if (onTagsChange) {
      const newTags = employeeTags.map(t => t.tag_type?.name || '');
      onTagsChange(newTags);
    }
  };

  // Indicadores de status do sistema
  const hasLoadingIssues = isLoadingEmployeeTags && isLoadingTagTypes && isLoadingRequiredTags;
  const hasDataIssues = !isLoadingTagTypes && tagTypes.length === 0;
  const systemHealthy = !hasLoadingIssues && !hasDataIssues && tagTypes.length > 0;

  if (isLoadingEmployeeTags || isLoadingTagTypes || isLoadingRequiredTags) {
    return (
      <div className="space-y-4 border p-4 rounded-md">
        <FormLabel>Competências/Tags Técnicas</FormLabel>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          Carregando sistema de tags...
        </div>
      </div>
    );
  }

  // Modo Avançado com IA
  if (useAdvancedMode) {
    return (
      <TagSystemErrorBoundary>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-lg font-semibold">Sistema Avançado de Tags com IA</FormLabel>
            <div className="flex gap-2">
              <TagModeToggle
                useAdvancedMode={useAdvancedMode}
                showMigration={showMigration}
                showDebug={showDebug}
                onAdvancedModeToggle={() => setUseAdvancedMode(false)}
                onMigrationToggle={() => setShowMigration(!showMigration)}
                onDebugToggle={() => setShowDebug(!showDebug)}
              />
            </div>
          </div>
          
          <AdvancedTagsManager
            employeeId={employeeId}
            selectedRole={selectedRole}
            onTagsChange={onTagsChange}
          />

          {/* Integração com Avaliações */}
          {employeeId && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Integração com Avaliações</h3>
                <button
                  type="button"
                  onClick={() => setShowAssessmentIntegration(!showAssessmentIntegration)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showAssessmentIntegration ? 'Ocultar' : 'Mostrar'} Integração
                </button>
              </div>
              
              {showAssessmentIntegration && (
                <AssessmentIntegration
                  employeeId={employeeId}
                  roleId={selectedRole}
                />
              )}
            </div>
          )}
        </div>
      </TagSystemErrorBoundary>
    );
  }

  // Modo Simples (original com melhorias)
  return (
    <TagSystemErrorBoundary>
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FormLabel>Competências/Tags Técnicas</FormLabel>
            <TagSystemStatusIndicators
              hasLoadingIssues={hasLoadingIssues}
              hasDataIssues={hasDataIssues}
              systemHealthy={systemHealthy}
            />
          </div>
          <div className="flex gap-2">
            <TagModeToggle
              useAdvancedMode={useAdvancedMode}
              showMigration={showMigration}
              showDebug={showDebug}
              onAdvancedModeToggle={() => setUseAdvancedMode(true)}
              onMigrationToggle={() => setShowMigration(!showMigration)}
              onDebugToggle={() => setShowDebug(!showDebug)}
            />
            <AddTagDialog 
              employeeId={employeeId}
              availableTagTypes={availableTagTypes}
              onTagAdded={handleTagsChanged}
            />
          </div>
        </div>

        {/* Status da migração */}
        {showMigration && (
          <div className="mb-4">
            <TagMigrationStatus />
          </div>
        )}

        {/* Debug do sistema */}
        {showDebug && (
          <div className="mb-4">
            <TagSystemDebug />
          </div>
        )}

        {/* Aviso sobre problemas no sistema */}
        <TagSystemWarnings hasDataIssues={hasDataIssues} />

        {/* Tags obrigatórias em falta */}
        {missingRequiredTags.length > 0 && (
          <MissingRequiredTags missingRequiredTags={missingRequiredTags} />
        )}
        
        {/* Lista de tags atuais */}
        <CurrentTagsList 
          employeeId={employeeId}
          employeeTags={employeeTags}
          requiredTags={requiredTags}
          onTagRemoved={handleTagsChanged}
        />

        {/* Debug detalhado */}
        {showDebug && (
          <TagDebugSection
            employeeId={employeeId}
            selectedRole={selectedRole}
            useAdvancedMode={useAdvancedMode}
            availableTagTypesCount={availableTagTypes.length}
            employeeTagsCount={employeeTags.length}
            missingRequiredTagsCount={missingRequiredTags.length}
            isLoadingEmployeeTags={isLoadingEmployeeTags}
            isLoadingTagTypes={isLoadingTagTypes}
            isLoadingRequiredTags={isLoadingRequiredTags}
            systemHealthy={systemHealthy}
          />
        )}

        {/* Botão para mostrar integração com avaliações no modo simples */}
        {employeeId && (
          <div className="mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowAssessmentIntegration(!showAssessmentIntegration)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              🤖 {showAssessmentIntegration ? 'Ocultar' : 'Ver'} Recomendações de IA baseadas em Avaliações
            </button>
            
            {showAssessmentIntegration && (
              <div className="mt-4">
                <AssessmentIntegration
                  employeeId={employeeId}
                  roleId={selectedRole}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </TagSystemErrorBoundary>
  );
}
