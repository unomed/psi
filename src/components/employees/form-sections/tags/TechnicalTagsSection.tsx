
import { FormLabel } from "@/components/ui/form";
import { useEmployeeTags, useTagTypes } from "@/hooks/useEmployeeTags";
import { useRoleRequiredTags } from "@/hooks/useRoleRequiredTags";
import { AddTagDialog } from "./AddTagDialog";
import { MissingRequiredTags } from "./MissingRequiredTags";
import { CurrentTagsList } from "./CurrentTagsList";

interface TechnicalTagsSectionProps {
  employeeId?: string;
  selectedRole: string | null;
  onTagsChange?: (tags: string[]) => void;
}

export function TechnicalTagsSection({ employeeId, selectedRole, onTagsChange }: TechnicalTagsSectionProps) {
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
        <AddTagDialog 
          employeeId={employeeId}
          availableTagTypes={availableTagTypes}
          onTagAdded={handleTagsChanged}
        />
      </div>

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
    </div>
  );
}
