
import { FormLabel } from "@/components/ui/form";
import { useEmployeeTags, useTagTypes } from "@/hooks/useEmployeeTags";
import { useRoleRequiredTags } from "@/hooks/useRoleRequiredTags";
import { AddTagDialog } from "./AddTagDialog";
import { MissingRequiredTags } from "./MissingRequiredTags";
import { CurrentTagsList } from "./CurrentTagsList";
import { TagSystemDebug } from "./TagSystemDebug";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TechnicalTagsSectionProps {
  employeeId?: string;
  selectedRole: string | null;
  onTagsChange?: (tags: string[]) => void;
}

export function TechnicalTagsSection({ employeeId, selectedRole, onTagsChange }: TechnicalTagsSectionProps) {
  const [showDebug, setShowDebug] = useState(false);
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

  if (isLoadingEmployeeTags || isLoadingTagTypes || isLoadingRequiredTags) {
    return (
      <div className="space-y-4 border p-4 rounded-md">
        <FormLabel>Competências/Tags Técnicas</FormLabel>
        <div className="text-sm text-muted-foreground">Carregando tags...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <FormLabel>Competências/Tags Técnicas</FormLabel>
        <div className="flex gap-2">
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

      {showDebug && (
        <div className="mb-4">
          <TagSystemDebug />
        </div>
      )}

      {missingRequiredTags.length > 0 && (
        <MissingRequiredTags missingRequiredTags={missingRequiredTags} />
      )}
      
      <CurrentTagsList 
        employeeId={employeeId}
        employeeTags={employeeTags}
        requiredTags={requiredTags}
        onTagRemoved={handleTagsChanged}
      />

      {employeeId && (
        <div className="text-xs text-muted-foreground">
          ID do funcionário: {employeeId}
        </div>
      )}

      {/* Status de carregamento detalhado em modo debug */}
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
        </div>
      )}
    </div>
  );
}
