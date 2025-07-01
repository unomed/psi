
import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

interface RoleHeaderProps {
  role: string;
  onEdit: () => void;
  onDelete: () => void;
  isReadOnly?: boolean;
}

export function RoleHeader({ role, onEdit, onDelete, isReadOnly }: RoleHeaderProps) {
  if (isReadOnly) {
    return <TableHead>{role}</TableHead>;
  }

  return (
    <TableHead>
      <div className="flex items-center gap-2">
        <span>{role}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TableHead>
  );
}
