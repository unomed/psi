
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
  const { employeeTags } = useEmployeeTags(employeeId);
  const { tagTypes } = useTagTypes();
  const { requiredTags } = useRoleRequiredTags(selectedRole);

  const currentTagIds = employeeTags.map(t => t.tag_type_id);
  const availableTagTypes = tagTypes.filter(t => !currentTagIds.includes(t.id));
  
  const missingRequiredTags = requiredTags.filter(
    rt => !currentTagIds.includes(rt.tag_type_id)
  );

  const handleTagsChanged = () => {
    if (onTagsChange) {
      const newTags = employeeTags.map(t => t.tag_type?.name || '');
      onTagsChange(newTags);
    }
  };

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

      <MissingRequiredTags missingRequiredTags={missingRequiredTags} />
      
      <CurrentTagsList 
        employeeId={employeeId}
        employeeTags={employeeTags}
        requiredTags={requiredTags}
        onTagRemoved={handleTagsChanged}
      />
    </div>
  );
}
