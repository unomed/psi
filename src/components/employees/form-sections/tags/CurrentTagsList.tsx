
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useEmployeeTags } from "@/hooks/useEmployeeTags";
import type { EmployeeTag, RoleRequiredTag } from "@/types/tags";

interface CurrentTagsListProps {
  employeeId?: string;
  employeeTags: EmployeeTag[];
  requiredTags: RoleRequiredTag[];
  onTagRemoved?: () => void;
}

export function CurrentTagsList({ employeeId, employeeTags, requiredTags, onTagRemoved }: CurrentTagsListProps) {
  const { removeEmployeeTag } = useEmployeeTags(employeeId);

  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeEmployeeTag.mutateAsync(tagId);
      onTagRemoved?.();
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Tags Atuais</Label>
      <div className="flex flex-wrap gap-2">
        {employeeTags.map(tag => {
          const isRequired = requiredTags.some(rt => rt.tag_type_id === tag.tag_type_id);
          return (
            <Badge 
              key={tag.id} 
              variant={isRequired ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {tag.tag_type?.name}
              {isRequired && " ✓"}
              {employeeId && (
                <X 
                  className="h-3 w-3 cursor-pointer ml-1" 
                  onClick={() => handleRemoveTag(tag.id)}
                />
              )}
            </Badge>
          );
        })}
        {employeeTags.length === 0 && (
          <span className="text-muted-foreground text-sm">
            Nenhuma tag cadastrada
          </span>
        )}
      </div>
    </div>
  );
}
