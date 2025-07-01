
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { RoleRequiredTag } from "@/types/tags";

interface MissingRequiredTagsProps {
  missingRequiredTags: RoleRequiredTag[];
}

export function MissingRequiredTags({ missingRequiredTags }: MissingRequiredTagsProps) {
  if (missingRequiredTags.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="text-red-600">Tags Obrigatórias em Falta</Label>
      <div className="flex flex-wrap gap-2">
        {missingRequiredTags.map(tag => (
          <Badge key={tag.id} variant="destructive">
            {tag.tag_type?.name} (obrigatória)
          </Badge>
        ))}
      </div>
    </div>
  );
}
