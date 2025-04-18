
import type { RoleData } from "./RoleCard";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface RoleGridProps {
  roles: RoleData[];
  onEdit?: (role: RoleData) => void;
  onDelete?: (role: RoleData) => void;
  canEdit?: boolean;
}

export function RoleGrid({ roles, onEdit, onDelete, canEdit = true }: RoleGridProps) {
  return (
    <DataTable 
      columns={columns} 
      data={roles}
      meta={{
        onEdit: onEdit || (() => {}),
        onDelete: onDelete || (() => {}),
        onView: () => {},
        canEdit,
      }}
    />
  );
}
