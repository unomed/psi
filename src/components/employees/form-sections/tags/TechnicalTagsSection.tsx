
import { FormLabel } from "@/components/ui/form";
import { useEmployeeTags, useTagTypes } from "@/hooks/useEmployeeTags";
import { useRoleRequiredTags } from "@/hooks/useRoleRequiredTags";
import { AddTagDialog } from "./AddTagDialog";
import { MissingRequiredTags } from "./MissingRequiredTags";
import { CurrentTagsList } from "./CurrentTagsList";
import { TagSystemDebug } from "./TagSystemDebug";
import { TagMigrationStatus } from "./TagMigrationStatus";
import { TagSystemErrorBoundary } from "./TagSystemErrorBoundary";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Database } from "lucide-react";

interface TechnicalTagsSectionProps {
  employeeId?: string;
  selectedRole: string | null;
  onTagsChange?: (tags: string[]) => void;
}

export function TechnicalTagsSection({ employeeId, selectedRole, onTagsChange }: TechnicalTagsSectionProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  
  const { employeeTags, isLoading: isLoadingEmployeeTags } = useEmployeeTags(employeeId);
  const { tagTypes, isLoading: isLoadingTagTypes } = useTagTypes();
  const { requiredTags, isLoading: isLoadingRequiredTags } = useRoleRequiredTags(selectedRole);

  console.log("[TechnicalTagsSection] Estado atual:", {
    employeeId,
    selectedRole,
    employeeTagsCount: employeeTags.length,
    tagTypesCount: tagTypes.length,
    requiredTagsCount: requiredTags.length,
    isLoading: { employeeTags: isLoadingEmployeeTags, tagTypes: isLoadingTagTypes, requiredTags: isLoadingRequiredTags }
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

  return (
    <TagSystemErrorBoundary>
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FormLabel>Competências/Tags Técnicas</FormLabel>
            {systemHealthy ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setShowMigration(!showMigration)}
            >
              <Database className="h-4 w-4 mr-2" />
              Migração
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              🔧 Debug
            </Button>
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
        {hasDataIssues && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Sistema de Tags não inicializado</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Nenhum tipo de tag foi encontrado. Isso pode indicar que a migração não foi executada ou houve um problema na inicialização.
            </p>
          </div>
        )}

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

        {/* Informações técnicas */}
        {employeeId && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>ID do funcionário: {employeeId}</div>
            <div>Função selecionada: {selectedRole || 'Nenhuma'}</div>
          </div>
        )}

        {/* Status detalhado em modo debug */}
        {showDebug && (
          <div className="mt-4 p-3 bg-muted rounded text-xs space-y-1">
            <div>🏷️ Tipos disponíveis: {availableTagTypes.length}</div>
            <div>👤 Tags do funcionário: {employeeTags.length}</div>
            <div>⚠️ Tags obrigatórias em falta: {missingRequiredTags.length}</div>
            <div>🔄 Estados de carregamento: 
              Tags={isLoadingEmployeeTags ? "⏳" : "✅"}, 
              Tipos={isLoadingTagTypes ? "⏳" : "✅"}, 
              Obrigatórias={isLoadingRequiredTags ? "⏳" : "✅"}
            </div>
            <div>💚 Sistema saudável: {systemHealthy ? "✅" : "❌"}</div>
          </div>
        )}
      </div>
    </TagSystemErrorBoundary>
  );
}
