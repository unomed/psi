
import type { RoleData } from "./RoleCard";
import { RoleCard } from "./RoleCard";

interface RoleGridProps {
  roles: RoleData[];
  onEdit?: (role: RoleData) => void;
  onDelete?: (role: RoleData) => void;
  canEdit?: boolean;
}

export function RoleGrid({ roles, onEdit, onDelete, canEdit = true }: RoleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <RoleCard 
          key={role.id} 
          role={role} 
          onEdit={canEdit ? onEdit : undefined}
          onDelete={canEdit ? onDelete : undefined}
        />
      ))}
    </div>
  );
}
